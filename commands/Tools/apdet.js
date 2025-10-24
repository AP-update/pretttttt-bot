import fs from "fs";
import https from "https";
import path from "path";

export default {
  name: "update",
  category: "Tools",
  description: "Update file dari GitHub sesuai struktur folder",
  owner: false,
  admin: false,
  execute: async ({ bot, msg, args }) => {
    const url = args[0];
    if (!url) return bot.sendMessage(msg.chat.id, "❌ Masukkan URL file GitHub.");

    const fileName = url.split("/").pop();
    if (!fileName) return bot.sendMessage(msg.chat.id, "❌ URL tidak valid.");

    const rawUrl = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");

    const urlParts = rawUrl.split("/"); 
 
    const relativePath = urlParts.slice(6).join("/"); 

    const targetPath = path.join(process.cwd(), relativePath);

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });

    const file = fs.createWriteStream(targetPath);

    https.get(rawUrl, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(targetPath, () => {});
        bot.sendMessage(msg.chat.id, `❌ Gagal download file. Status: ${res.statusCode}`);
        return;
      }

      res.pipe(file);
      file.on("finish", () => {
        file.close();

        const restartMessage = `
✅ File **${fileName}** berhasil diupdate dan disimpan di: \`${targetPath}\`
🛠️ **PENTING:** Silakan **RESTART BOT** untuk menerapkan perubahan.

*Cara Restart:*
1. **PM2:** \`pm2 restart prettttttt-bot\`
2. **Node:** Hentikan (\`Ctrl+C\`) dan jalankan kembali (\`node index.js\`)
`;
        bot.sendMessage(msg.chat.id, restartMessage, { parse_mode: "Markdown" });
      });
    }).on("error", (err) => {
      fs.unlink(targetPath, () => {});
      bot.sendMessage(msg.chat.id, "❌ Terjadi error saat download: " + err.message);
    });
  },
};