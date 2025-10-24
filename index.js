import TelegramBot from "node-telegram-bot-api";
import chalk from "chalk";
import fs from "fs";
import path from "path"; 
import { fileURLToPath } from "url"; 
import fetch from "node-fetch";
import { BOT_TOKEN, OWNER_ID, ADMINS } from "./config.js";
import { reloadCommands } from "./utils/reload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const USERS_FILE = "./users.json";
let users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")) : [];
const saveUsers = () => fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

let commands = await reloadCommands();

console.log(chalk.bgBlueBright.white("🤖 Telegram Bot Running"));
console.log(chalk.green(`Owner ID: ${OWNER_ID}`));
console.log(chalk.magenta(`Commands loaded: ${Object.keys(commands).length}`));
console.log(chalk.cyan(`Users: ${users.length}`));
console.log(chalk.yellow(`Uptime: ${process.uptime().toFixed(0)}s`));
console.log(chalk.bgGreen.white("✅ Bot polling..."));

const commandsDir = path.join(__dirname, "commands"); 

fs.watch(commandsDir, { recursive: true }, async (eventType, filename) => {
    
    if (filename && (eventType === 'change' || eventType === 'rename')) {
        console.log(chalk.magenta(`⚡ Perubahan terdeteksi (${eventType}): ${filename}. Auto-reloading...`));
        try {
            
            commands = await reloadCommands();
            console.log(chalk.bgGreen.white(`✅ Commands berhasil di-reload otomatis. Total: ${Object.keys(commands).length}`));
        } catch (error) {
            console.error(chalk.red("❌ Error saat auto-reload commands:"), error);
        }
    }
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name;
  const userId = msg.from.id;

  let content = "";
  if (msg.text) content = msg.text;
  else if (msg.sticker) content = `[Sticker] ${msg.sticker.emoji || ""}`;
  else if (msg.photo) content = `[Photo] file_id: ${msg.photo[msg.photo.length - 1].file_id}`;
  else if (msg.voice) content = `[Voice] duration: ${msg.voice.duration}s`;
  else if (msg.video) content = `[Video] file_id: ${msg.video.file_id}`;
  else if (msg.document) content = `[Document] ${msg.document.file_name}`;
  else content = "[Unknown message type]";

  console.log(chalk.yellow(`📩 Message from ${username} (${userId}): ${content}`));

  if (!users.includes(chatId)) {
    users.push(chatId);
    saveUsers();
  }

  if (!msg.text || !msg.text.startsWith("/")) return;
  const text = msg.text;

  if (text.toLowerCase() === "/menu") {
    const categories = {};
    
    Object.values(commands).forEach(c => {
     
      if (c && typeof c === 'object' && c.name) {
          const cat = c.category || "Other";
          if (!categories[cat]) categories[cat] = [];
          categories[cat].push(c);
      }
    });

    let menuText = "📜 *Menu Bot*\n\n";
    Object.keys(categories).forEach(cat => {
      menuText += `📂 *${cat}*\n`;
      categories[cat].forEach(c => {
        menuText += `- /${c.name} : ${c.description || "Tidak ada deskripsi"}\n`;
      });
      menuText += "\n";
    });

    bot.sendMessage(chatId, menuText, { parse_mode: "Markdown" });
    console.log(chalk.blue(`✔ [menu] sent to ${username} (${userId})`));
    return;
  }

  const args = text.split(" ");
  const cmdName = args.shift().replace("/", "").toLowerCase();
  const cmd = commands[cmdName];

  if (!cmd) {
    console.log(chalk.red(`❌ Command not found: ${cmdName} by ${username} (${userId})`));
    return bot.sendMessage(chatId, "❌ Command tidak ditemukan.");
  }

  if (cmd.owner && userId.toString() !== OWNER_ID) {
    console.log(chalk.red(`❌ Unauthorized owner command: ${cmdName} by ${username} (${userId})`));
    return bot.sendMessage(chatId, "Hanya owner bisa pakai command ini.");
  }

  if (cmd.admin && !ADMINS.includes(userId.toString()) && userId.toString() !== OWNER_ID) {
    console.log(chalk.red(`❌ Unauthorized admin command: ${cmdName} by ${username} (${userId})`));
    return bot.sendMessage(chatId, "Hanya admin/owner bisa pakai command ini.");
  }

  try {
    await cmd.execute({ bot, msg, args, fetch });
    console.log(chalk.green("✔") + chalk.blue(` [${cmd.name}] executed by ${username} (${userId})`));
  } catch (e) {
    console.error(chalk.red("❌ Error executing command:"), e);
    bot.sendMessage(chatId, "⚠️ Terjadi kesalahan saat menjalankan command."); 
  }
});

bot.onText(/\/reload/, async (msg) => {
  if (msg.from.id.toString() !== OWNER_ID) return;
  
  try {
    commands = await reloadCommands();
    bot.sendMessage(msg.chat.id, "🔄 Commands berhasil di-reload ✅");
    console.log(chalk.green(`🔄 Commands reloaded by ${msg.from.username || msg.from.first_name} (${msg.from.id}). Total: ${Object.keys(commands).length}`));
  } catch (e) {
      console.error(chalk.red("❌ Error manual reload:"), e);
      bot.sendMessage(msg.chat.id, "❌ Gagal me-reload commands. Cek konsol.");
  }
});
