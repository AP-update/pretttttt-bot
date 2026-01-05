import axios from "axios";

/**
 * Carbonara Code-to-Image for Telegram Bot
 * Fitur: Custom Theme, Auto-JSON Formatting, & Theme List
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
  description: "Ubah kode jadi gambar estetik dengan tema custom 🎨",
  execute: async ({ bot, msg }) => {
    const themes = [
      "3024 night", "a11y dark", "blackboard", "base16 dark", "base16 light",
      "cobalt", "dracula", "dracula pro", "duotone dark", "hopscotch",
      "lucario", "material", "monokai", "night owl", "nord", "oceanic next",
      "one dark", "one light", "panda syntax", "paraiso dark", "seti",
      "shades of purple", "solarized dark", "solarized light", "synthwave '84",
      "twilight", "verminal", "vscode", "yeti", "zenburn"
    ];

    const helpText = `🎨 *CARBONARA THEMES*\n\n` +
      `Gunakan format: \`/carbon tema|kode\`\n\n` +
      `*Daftar Tema Tersedia:* \n` + 
      themes.map(t => `◦ ${t.charAt(0).toUpperCase() + t.slice(1)}`).join("\n") + 
      `\n\n*Contoh:*\n\`/carbon monokai|console.log("hello world")\``;

    try {
      // Mengambil teks setelah command /carbon
      const args = msg.text?.split(" ").slice(1).join(" ");

      if (!args) {
        return await bot.sendMessage(msg.chat.id, helpText, { parse_mode: "Markdown" });
      }

      let theme = "dracula"; 
      let code = args;

      // Logika pemisahan tema dan kode
      if (args.includes("|")) {
        const parts = args.split("|");
        const inputTheme = parts[0].trim().toLowerCase();
        
        if (themes.includes(inputTheme)) {
          theme = inputTheme;
          code = parts.slice(1).join("|").trim();
        } else {
          return await bot.sendMessage(msg.chat.id, `❌ Tema *"${inputTheme}"* tidak ditemukan!\n\n${helpText}`, { parse_mode: "Markdown" });
        }
      }

      // Merapikan JSON otomatis jika input valid JSON
      try {
        const parsed = JSON.parse(code);
        code = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // Biarkan teks original jika bukan JSON
      }

      // Pesan Loading
      const proses = await bot.sendMessage(msg.chat.id, `⏳ _Memproses gambar dengan tema ${theme}..._`, { parse_mode: "Markdown" });

      const imageBuffer = await generateCarbonImage(code, theme);

      // Kirim Foto
      await bot.sendPhoto(msg.chat.id, imageBuffer, {
        caption: `✅ *Success!*\n*Theme:* ${theme.toUpperCase()}\n\n_Hasil visualisasi kode Anda._`,
        parse_mode: "Markdown"
      });

      // Hapus pesan loading
      await bot.deleteMessage(msg.chat.id, proses.message_id);

    } catch (err) {
      console.error("[CARBON ERROR]", err);
      await bot.sendMessage(msg.chat.id, "❌ Terjadi kesalahan saat membuat gambar. Pastikan kode Anda benar.");
    }
  },
};
