
import axios from "axios";
import FormData from "form-data";
// Pastikan path "../config.js" benar sesuai posisi file ini
import { BOT_TOKEN } from "../config.js"; 

export default {
  name: "hd",
  category: "Tools",
  description: "Tingkatkan kualitas foto hingga 2x resolusi",
  owner: false,
  admin: false,
  execute: async ({ bot, msg }) => {
    const chatId = msg.chat.id;
    
    // Cek foto di pesan langsung atau di pesan yang dibalas
    const photo = msg.photo || (msg.reply_to_message && msg.reply_to_message.photo);

    if (!photo) {
      return bot.sendMessage(chatId, "📌 Silakan kirim foto atau *balas foto* dengan perintah /hd", { parse_mode: "Markdown" });
    }

    // Ambil resolusi foto tertinggi
    const fileId = photo[photo.length - 1].file_id;
    const loadingMsg = await bot.sendMessage(chatId, "⏳ Sedang memproses gambar ke HD...");

    try {
      // 1. Ambil path file dari Telegram
      const fileInfo = await bot.getFile(fileId);
      
      // 2. Susun URL download menggunakan BOT_TOKEN dari config.js
      const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;

      // 3. Download gambar sebagai Buffer
      const imageResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(imageResponse.data);

      // 4. Siapkan Form Data untuk API Pixelcut
      const form = new FormData();
      form.append("image", buffer, { 
        filename: "upscale.jpg", 
        contentType: "image/jpeg" 
      });
      form.append("scale", "2");

      const headers = {
        ...form.getHeaders(),
        "accept": "application/json",
        "x-client-version": "web",
        "x-locale": "en",
      };

      // 5. Kirim ke API Pixelcut
      const res = await axios.post("https://api2.pixelcut.app/image/upscale/v1", form, { headers });
      
      if (!res.data?.result_url) throw new Error("API tidak memberikan hasil.");

      // 6. Kirim hasil foto HD ke user
      await bot.sendPhoto(chatId, res.data.result_url, {
        caption: `✨ *Berhasil Ditingkatkan!*\nKualitas foto sekarang 2x lebih tajam.`,
        parse_mode: "Markdown"
      });

    } catch (e) {
      console.error("[HD ERROR]", e);
      bot.sendMessage(chatId, `❌ Gagal memproses gambar: ${e.message}`);
    } finally {
      // Hapus pesan loading agar chat tetap bersih
      bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
    }
  },
};
