export default {
  name: "lirik",
  category: "Search",
  description: "Cari lirik lagu berdasarkan judul 🎵",
  owner: false,
  admin: false,
  execute: async ({ bot, msg, fetch }) => {
    try {
      const title = msg.text?.split(" ").slice(1).join(" ");
      if (!title)
        return await bot.sendMessage(
          msg.chat.id,
          "❗ Masukkan judul lagu setelah perintah.\nContoh: `/lirik so far away avenged`"
        );

      const res = await fetch(`https://api.zenzxz.my.id/api/tools/lirik?title=${encodeURIComponent(title)}`);
      const data = await res.json();

      if (!data.success || !data.data?.result?.length)
        return await bot.sendMessage(msg.chat.id, "⚠️ Lirik tidak ditemukan.");

      const song = data.data.result[0];

      const reply = `🎧 *${song.trackName}* — _${song.artistName}_\n💿 Album: *${song.albumName}*\n\n📝 *Lirik:*\n${song.plainLyrics}`;

      await bot.sendMessage(msg.chat.id, reply, {
        parse_mode: "Markdown",
        disable_web_page_preview: true
      });
    } catch (err) {
      console.error(err);
      await bot.sendMessage(msg.chat.id, "❌ Terjadi kesalahan saat mengambil lirik.");
    }
  },
};