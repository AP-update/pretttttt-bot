import axios from "axios";

const LoveTik = {
  async dapatkan(url) {
    const { data } = await axios.post(
      "https://lovetik.com/api/ajax/search",
      `query=${encodeURIComponent(url)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );

    if (!data?.links) throw new Error("Data TikTok tidak ditemukan");

    const result = {
      video: [],
      audio: [],
      images: data.images || [],
    };

    data.links.forEach((item) => {
      if (!item.a) return;

      const formatted = {
        format: item.t.replace(/<.*?>|♪/g, "").trim(),
        resolution: item.s || "Audio Only",
        link: item.a,
      };

      if (item.ft == 1) {
        result.video.push(formatted);
      } else {
        result.audio.push(formatted);
      }
    });

    return result;
  },
};

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
          "📎 Masukkan URL TikTok!\nContoh: `/tt https://vt.tiktok.com/xxxxxx`"
        );

      if (!text.includes("tiktok.com"))
        return await bot.sendMessage(
          msg.chat.id,
          "❌ Link TikTok tidak valid!"
        );

      await bot.sendChatAction(msg.chat.id, "typing");
      const loadingMsg = await bot.sendMessage(
        msg.chat.id,
        "⏳ Sedang mengambil data dari TikTok..."
      );

      // 🔥 ambil data dari Lovetik
      const data = await LoveTik.dapatkan(text);

      let videoLink = null;
      if (data.video.length > 0) {
        const best = data.video.reduce((a, b) => {
          const aRes = parseInt(a.resolution.replace(/\D/g, "")) || 0;
          const bRes = parseInt(b.resolution.replace(/\D/g, "")) || 0;
          return aRes > bRes ? a : b;
        });
        videoLink = best.link;
      }

      const musicLink = data.audio.find(
        (a) => a.format.toLowerCase().includes("mp3")
      )?.link;

      if (!videoLink && !musicLink)
        throw new Error("Video atau audio tidak ditemukan.");

      if (videoLink) {
        await bot.sendVideo(msg.chat.id, videoLink, {
          caption: "🎬 Video TikTok Tanpa Watermark",
        });
      }

      if (musicLink) {
        await bot.sendAudio(msg.chat.id, musicLink, {
          title: "🎧 Audio TikTok",
          fileName: "tiktok-audio.mp3",
        });
      }

      if (loadingMsg?.message_id) {
        await bot
          .deleteMessage(msg.chat.id, loadingMsg.message_id)
          .catch(() => {});
      }
    } catch (e) {
      console.error("[TIKTOK ERROR]", e);
      await bot.sendMessage(
        msg.chat.id,
        `❌ Gagal mengambil data TikTok.\n\n_Log:_ ${e.message}`
      );
    }
  },
};
