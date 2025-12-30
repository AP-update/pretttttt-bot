import axios from "axios";
import FormData from "form-data";
import { BOT_TOKEN } from "../config.js"; // sesuaikan path bila perlu

export default {
  name: "hd",
  category: "Tools",
  description: "Tingkatkan kualitas foto hingga 2x resolusi",
  owner: false,
  admin: false,

  execute: async ({ bot, msg }) => {
    try {
      // Validasi: harus reply foto
      if (!msg.reply_to_message || !msg.reply_to_message.photo) {
        return bot.sendMessage(
          msg.chat.id,
          "📌 Balas *foto* dengan perintah:\n/hd",
          { parse_mode: "Markdown" }
        );
      }

      await bot.sendMessage(msg.chat.id, "⏳ Memproses gambar...");

      // Ambil foto resolusi terbesar
      const photo = msg.reply_to_message.photo.pop();
      const file = await bot.getFile(photo.file_id);
      const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

      // Download foto
      const image = await axios.get(fileUrl, { responseType: "arraybuffer" });

      // Upload ke Pixelcut
      const form = new FormData();
      form.append("image", image.data, { filename: "image.jpg" });
      form.append("scale", "2");

      const res = await axios.post(
        "https://api2.pixelcut.app/image/upscale/v1",
        form,
        { headers: form.getHeaders() }
      );

      if (!res.data?.result_url) throw new Error("Upscale gagal.");

      // Ambil hasil upscale
      const result = await axios.get(res.data.result_url, { responseType: "arraybuffer" });

      // Kirim ke user
      await bot.sendPhoto(msg.chat.id, result.data, {
        caption: "✨ *Berhasil!* Resolusi gambar ditingkatkan hingga 2x.",
        parse_mode: "Markdown"
      });

    } catch (err) {
      console.error("[HD ERROR]", err);
      await bot.sendMessage(msg.chat.id, "❌ Gagal memproses gambar.");
    }
  }
};
