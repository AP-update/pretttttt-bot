import axios from "axios";
import { load } from "cheerio";
import qs from "qs";

async function JHINSave(instaUrl) {
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const data = qs.stringify({ url: instaUrl, lang: "en" });

  try {
    const res = await axios.post("https://api.instasave.website/media", data, { headers });
    const html = (res.data.match(/innerHTML\s*=\s*"(.+?)";/s)?.[1] || "").replace(/\\"/g, '"');

    const $ = load(html);
    const result = [];
    $(".download-items").each((_, el) => {
      const url = $(el).find('a[title="Download"]').attr("href");
      const type = $(el).find(".format-icon i").attr("class")?.includes("ivideo") ? "video" : "image";
      if (url) result.push({ type, url });
    });

    if (!result.length) throw new Error("Media not found");
    return result;
  } catch (e) {
    return { error: e.response?.data || e.message };
  }
}

export default {
  name: "ig",
  category: "Downloader",
  description: "Download foto atau video dari Instagram 📸",
  owner: false,
  admin: false,

  execute: async ({ bot, msg }) => {
    try {
      const text = msg.text?.split(" ").slice(1).join(" ");
      if (!text)
        return await bot.sendMessage(
          msg.chat.id,
          "📎 Masukkan URL Instagram!\nContoh: `/ig https://www.instagram.com/p/xxxxxxx`"
        );

      await bot.sendChatAction(msg.chat.id, "typing");
      const loadingMsg = await bot.sendMessage(msg.chat.id, "⏳ Sedang mengambil media dari Instagram...");

      const result = await JHINSave(text);

      if (!result || result.error) {
        throw new Error(typeof result?.error === "string" ? result.error : "Gagal mengambil media.");
      }

      if (!Array.isArray(result) || !result.length) {
        throw new Error("Media tidak ditemukan atau link tidak valid.");
      }

      for (let i = 0; i < result.length; i++) {
        const item = result[i];
        const caption = `📥 Instagram Download (${i + 1}/${result.length})`;

        if (item.type === "video" && item.url) {
          await bot.sendVideo(msg.chat.id, item.url, { caption });
        } else if (item.type === "image" && item.url) {
          await bot.sendPhoto(msg.chat.id, item.url, { caption });
        } else {
          await bot.sendMessage(msg.chat.id, "⚠️ Media tidak valid atau URL kosong.");
        }
      }

      if (loadingMsg?.message_id) {
        await bot.deleteMessage(msg.chat.id, loadingMsg.message_id).catch(() => {});
      }

    } catch (e) {
      console.error("[INSTAGRAM ERROR]", e);
      const errMsg = e.message || "Terjadi kesalahan tak terduga.";
      await bot.sendMessage(msg.chat.id, `❌ Gagal mengambil data Instagram.\n\n_Log:_ ${errMsg}`);
    }
  },
};