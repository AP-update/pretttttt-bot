import axios from "axios";
import FormData from "form-data";

export default {
  name: "hd",
  category: "Tools",
  description: "Tingkatkan kualitas foto hingga 2x resolusi",
  owner: false,
  admin: false,
  execute: async ({ bot, msg }) => {
    const chatId = msg.chat.id;
    
    // Cek apakah pesan berisi foto atau membalas foto
    const photo = msg.photo || (msg.reply_to_message && msg.reply_to_message.photo);

    if (!photo) {
      return bot.sendMessage(chatId, "📌 Kirim atau *balas gambar* dengan perintah /hd", { parse_mode: "Markdown" });
    }

    // Ambil file_id dari resolusi foto tertinggi
    const fileId = photo[photo.length - 1].file_id;
    const loadingMsg = await bot.sendMessage(chatId, "⏳ Sedang memproses gambar, mohon tunggu...");

    try {
      // 1. Dapatkan Link File dari Telegram
      const file = await bot.getFile(fileId);
      const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;

      // 2. Download Gambar sebagai Buffer
      const imageResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(imageResponse.data);

      // 3. Siapkan Form Data untuk Pixelcut
      const form = new FormData();
      form.append("image", buffer, { 
        filename: `upscale_${Date.now()}.jpg`, 
        contentType: "image/jpeg" 
      });
      form.append("scale", "2");

      const headers = {
        ...form.getHeaders(),
        "accept": "application/json",
        "x-client-version": "web",
        "x-locale": "en",
      };

      // 4. Kirim ke API Pixelcut
      const res = await axios.post("https://api2.pixelcut.app/image/upscale/v1", form, { headers });
      
      if (!res.data?.result_url) throw new Error("Gagal mendapatkan URL hasil.");

      // 5. Kirim Hasil Kembali ke User
      await bot.sendPhoto(chatId, res.data.result_url, {
        caption: `✨ *Upscale Berhasil!*\n\nKualitas telah ditingkatkan 2x lebih tajam.`,
        parse_mode: "Markdown"
      });

    } catch (e) {
      console.error("[HD ERROR]", e);
      bot.sendMessage(chatId, `❌ Gagal memproses gambar: ${e.message}`);
    } finally {
      // Hapus pesan loading
      bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {});
    }
  },
};
