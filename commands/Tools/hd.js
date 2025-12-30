
import axios from "axios";
import FormData from "form-data";
// Kita tetap butuh import ini untuk keperluan lain jika ada, 
// tapi kita tidak akan memakainya untuk menyusun URL download lagi.
import { BOT_TOKEN } from "../config.js"; 

export default {
  name: "hd",
  category: "Tools",
  description: "Tingkatkan kualitas foto hingga 2x resolusi",
  execute: async ({ bot, msg }) => {
    const chatId = msg.chat.id;
    const photo = msg.photo || (msg.reply_to_message && msg.reply_to_message.photo);

    if (!photo) return bot.sendMessage(chatId, "📌 Balas gambar dengan /hd");

    const fileId = photo[photo.length - 1].file_id;
    const loadingMsg = await bot.sendMessage(chatId, "⏳ Sedang memproses...");

    try {
      // --- CARA LAIN: MENGGUNAKAN GETFILESTREAM ---
      // Cara ini otomatis menggunakan token yang sudah terpasang di bot kamu
      const fileStream = bot.getFileStream(fileId);

      // Kita konversi stream menjadi buffer agar bisa dikirim ke Pixelcut
      const chunks = [];
      for await (const chunk of fileStream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // --- PROSES KIRIM KE PIXELCUT ---
      const form = new FormData();
      form.append("image", buffer, { filename: "image.jpg" });
      form.append("scale", "2");

      const res = await axios.post("https://api2.pixelcut.app/image/upscale/v1", form, {
        headers: {
          ...form.getHeaders(),
          "accept": "application/json",
          "x-client-version": "web"
        }
      });

      if (res.data?.result_url) {
        await bot.sendPhoto(chatId, res.data.result_url, {
          caption: "✨ Berhasil ditingkatkan ke HD!"
        });
      }

    } catch (e) {
      console.error(e);
      bot.sendMessage(chatId, `❌ Gagal: ${e.message}`);
    } finally {
      bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
    }
  },
};
