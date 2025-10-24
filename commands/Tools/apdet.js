import fs from "fs";
import https from "https";
import { exec } from "child_process";

export default {
  name: "update",
  category: "Tools",
  description: "buat update",
  owner: false,
  admin: false,
  execute: async ({ bot, msg, args }) => {
    const url = args[0];
    if (!url) return bot.sendMessage(msg.chat.id, "❌ Masukkan URL file GitHub.");

    const fileName = url.split("/").pop();
    if (!fileName) return bot.sendMessage(msg.chat.id, "❌ URL tidak valid.");

    const file = fs.createWriteStream(fileName);

    https.get(url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/"), (res) => {
      if (res.statusCode !== 200) {
        bot.sendMessage(msg.chat.id, `❌ Gagal download file. Status: ${res.statusCode}`);
        return;
      }

      res.pipe(file);
      file.on("finish", () => {
        file.close();
        bot.sendMessage(msg.chat.id, `✅ File ${fileName} berhasil diupdate. Bot akan restart...`);

        // Restart bot otomatis (hanya di Termux / Linux)
        exec("pm2 restart prettttttt-bot || node index.js", (err) => {
          if (err) console.log("Restart error:", err);
        });
      });
    }).on("error", (err) => {
      bot.sendMessage(msg.chat.id, "❌ Terjadi error saat download: " + err.message);
    });
  },
};