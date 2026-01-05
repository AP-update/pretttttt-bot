import axios from "axios";

/**
 * Carbonara Code-to-Image for Telegram Bot
 * Support tema dengan spasi (e.g., "One Dark", "Night Owl")
 */

async function generateCarbonImage(code, selectedTheme) {
  const CONFIG = {
    API_URL: 'https://carbonara.solopov.dev/api/cook',
    UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    TIMEOUT: 30000
  };

  const payload = {
    code: code,
    language: 'javascript',
    theme: selectedTheme.toLowerCase(),
    backgroundColor: "#1F2937",
    dropShadow: true,
    windowControls: true,
    widthAdjustment: true,
    lineNumbers: true,
    paddingVertical: "48px",
    paddingHorizontal: "48px"
  };

  const response = await axios.post(CONFIG.API_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': CONFIG.UA
    },
    responseType: 'arraybuffer',
    timeout: CONFIG.TIMEOUT
  });

  return Buffer.from(response.data);
}

export default {
  name: "carbon",
  category: "Tools",
  description: "Ubah kode jadi gambar dengan tema custom 🎨",
  execute: async ({ bot, msg }) => {
    const themes = [
      "3024 night", "a11y dark", "blackboard", "base16 dark", "base16 light",
      "cobalt", "dracula", "dracula pro", "duotone dark", "hopscotch",
      "lucario", "material", "monokai", "night owl", "nord", "oceanic next",
      "one dark", "one light", "panda syntax", "paraiso dark", "seti",
      "shades of purple", "solarized dark", "solarized light", "synthwave '84",
      "twilight", "verminal", "vscode", "yeti", "zenburn"
    ];

    try {
      // Ambil seluruh teks setelah perintah /carbon
      const fullText = msg.text?.substring(msg.text.indexOf(" ") + 1).trim();

      // Jika tidak ada teks sama sekali atau hanya mengetik command
      if (!fullText || msg.text === "/carbon") {
        const helpText = `🎨 *CARBONARA THEMES*\n\n` +
          `Gunakan format: \`/carbon tema|kode\`\n\n` +
          `*Daftar Tema:* \n` + 
          themes.map(t => `◦ ${t.replace(/\b\w/g, l => l.toUpperCase())}`).join("\n") + 
          `\n\n*Contoh:*\n\`/carbon One Dark|console.log("Halo")\``;
        return await bot.sendMessage(msg.chat.id, helpText, { parse_mode: "Markdown" });
      }

      let theme = "dracula"; 
      let code = fullText;

      // KUNCI PERBAIKAN: Pisahkan berdasarkan karakter '|' saja
      if (fullText.includes("|")) {
        const [inputTheme, ...codeParts] = fullText.split("|");
        const cleanTheme = inputTheme.trim().toLowerCase();
        
        if (themes.includes(cleanTheme)) {
          theme = cleanTheme;
          code = codeParts.join("|").trim(); // Gabungkan sisa bagian jika ada pipe di dalam kode
        } else {
          return await bot.sendMessage(msg.chat.id, `❌ Tema *"${inputTheme.trim()}"* tidak valid.\nCek daftar tema dengan mengetik \`/carbon\``, { parse_mode: "Markdown" });
        }
      }

      // Rapikan JSON otomatis
      try {
        const parsed = JSON.parse(code);
        code = JSON.stringify(parsed, null, 2);
      } catch (e) {}

      const proses = await bot.sendMessage(msg.chat.id, `⏳ _Sedang memproses tema ${theme.toUpperCase()}..._`, { parse_mode: "Markdown" });

      const imageBuffer = await generateCarbonImage(code, theme);

      await bot.sendPhoto(msg.chat.id, imageBuffer, {
        caption: `✅ *Success!*\n*Theme:* ${theme.toUpperCase()}`,
        parse_mode: "Markdown"
      });

      await bot.deleteMessage(msg.chat.id, proses.message_id);

    } catch (err) {
      console.error("[CARBON ERROR]", err);
      await bot.sendMessage(msg.chat.id, "❌ Terjadi kesalahan teknis.");
    }
  },
};

