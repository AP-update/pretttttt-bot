export default {
  name: "feloai",
  category: "AI",
  description: "Balas pesan dengan kecerdasan FeloAI 🤖",
  owner: false,
  admin: false,
  execute: async ({ bot, msg, fetch }) => {
    try {
      const text = msg.text?.split(" ").slice(1).join(" ");
      if (!text)
        return await bot.sendMessage(
          msg.chat.id,
          "❗ Masukkan teks setelah perintah.\nContoh: `/feloai halloo`"
        );

      const res = await fetch(`https://api.nekolabs.my.id/ai/feloai?text=${encodeURIComponent(text)}`);
      const data = await res.json();

      if (data.success && data.result) {
        const reply = `✨ *FeloAI berkata:*\n\n${data.result.text}`;
        await bot.sendMessage(msg.chat.id, reply, {
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        });
      } else {
        await bot.sendMessage(msg.chat.id, "⚠️ Tidak ada respons dari *FeloAI*.");
      }
    } catch (err) {
      console.error(err);
      await bot.sendMessage(msg.chat.id, "❌ Terjadi kesalahan saat memproses permintaan.");
    }
  },
};