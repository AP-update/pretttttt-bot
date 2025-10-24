import axios from "axios";

export default {
  name: "tt",
  category: "Downloader",
  description: "Download video atau audio TikTok tanpa watermark 🎵",
  owner: false,
  admin: false,

  execute: async ({ bot, msg }) => {
    try {
      const text = msg.text?.split(" ").slice(1).join(" ");
      if (!text)
        return await bot.sendMessage(
          msg.chat.id,
          "📎 Masukkan URL TikTok!\nContoh: `/tiktok https://vt.tiktok.com/xxxxxx`"
        );

      if (!text.includes("tiktok.com"))
        return await bot.sendMessage(msg.chat.id, "❌ Link TikTok tidak valid!");

      await bot.sendChatAction(msg.chat.id, "typing");
      const loadingMsg = await bot.sendMessage(
        msg.chat.id,
        "⏳ Sedang mengambil data dari TikTok..."
      );

     
      async function getTiktok(url) {
        const { data } = await axios.get(
          `https://api-ape.my.id/download/tiktok?url=${encodeURIComponent(url)}`
        );

        if (!data?.result)
          throw new Error("Gagal mengambil data dari API TikTok.");

        const result = data.result;

        let videoLink = null;
        if (result.video?.length > 0) {
          const highestQuality = result.video.reduce((a, b) => {
            const aRes = parseInt(a.resolution.replace(/\D/g, "")) || 0;
            const bRes = parseInt(b.resolution.replace(/\D/g, "")) || 0;
            return aRes > bRes ? a : b;
          });
          videoLink = highestQuality.link;
        }

        // ambil link audio mp3
        const musicLink = result.audio?.find(
          (a) => a.format === "MP3 Audio"
        )?.link;

        return {
          no_watermark: videoLink,
          music: musicLink,
        };
      }

      const result = await getTiktok(text);

      if (!result.no_watermark && !result.music) {
        throw new Error("Video atau audio tidak ditemukan dari link tersebut.");
      }

      if (result.no_watermark) {
        await bot.sendVideo(msg.chat.id, result.no_watermark, {
          caption: "🎬 Video TikTok Tanpa Watermark",
        });
      }

      if (result.music) {
        await bot.sendAudio(msg.chat.id, result.music, {
          title: "🎧 Audio TikTok",
          fileName: "tiktok-audio.mp3",
        });
      }

      if (loadingMsg?.message_id) {
        await bot.deleteMessage(msg.chat.id, loadingMsg.message_id).catch(() => {});
      }
    } catch (e) {
      console.error("[TIKTOK ERROR]", e);
      const errMsg = e.message || "Terjadi kesalahan tak terduga.";
      await bot.sendMessage(
        msg.chat.id,
        `❌ Gagal mengambil data TikTok.\n\n_Log:_ ${errMsg}`
      );
    }
  },
};