import fs from "fs";

export default {
  name: "broadcast",
  category: "Admin",
  description: "Kirim pesan ke semua user",
  owner: true,
  admin: false,
  execute: async ({ bot, msg, args }) => {
    const USERS_FILE = "./users.json";
    if (!fs.existsSync(USERS_FILE)) return bot.sendMessage(msg.chat.id, "❌ users.json tidak ditemukan.");

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    const text = args.join(" ");
    if (!text) return bot.sendMessage(msg.chat.id, "❌ Tambahkan pesan yang ingin dikirim.");

    let count = 0;
    for (const id of users) {
      try {
        await bot.sendMessage(id, `📢 Broadcast:\n${text}`);
        count++;
      } catch {}
    }
    await bot.sendMessage(msg.chat.id, `✅ Broadcast terkirim ke ${count} user.`);
  },
};