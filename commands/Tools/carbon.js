import axios from "axios";

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
    headers: { 'Content-Type': 'application/json', 'User-Agent': CONFIG.UA },
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
      // PERBAIKAN: Mengambil teks murni setelah /carbon tanpa mempedulikan spasi awal
      const inputRaw = msg.text.includes(" ") ? msg.text.split(/\s(.+)/)[1] : "";

      if (!inputRaw) {
        const listTema = themes.map(t => `◦ ${t.replace(/\b\w/g, l => l.toUpperCase())}`).join("\n");
        return await bot.sendMessage(msg.chat.id, `🎨 *CARBONARA HELP*\n\nFormat: \`/carbon tema|kode\`\n\n*Daftar Tema:*\n${listTema}`, { parse_mode: "Markdown" });
      }

      let theme = "dracula"; // Default
      let code = inputRaw;

      // Logika: Jika ada simbol |, maka kita bedah temanya
      if (inputRaw.includes("|")) {
        // split hanya pada pipe pertama
        const firstPipeIndex = inputRaw.indexOf("|");
        const stringTheme = inputRaw.substring(0, firstPipeIndex).trim().toLowerCase();
        const stringCode = inputRaw.substring(firstPipeIndex + 1).trim();

        if (themes.includes(stringTheme)) {
          theme = stringTheme;
          code = stringCode;
        }
      }

      // Rapikan JSON jika input adalah JSON
      try {
        const parsed = JSON.parse(code);
        code = JSON.stringify(parsed, null, 2);
      } catch (e) {}

      const proses = await bot.sendMessage(msg.chat.id, `⏳ _Memproses dengan tema: ${theme.toUpperCase()}..._`, { parse_mode: "Markdown" });

      const imageBuffer = await generateCarbonImage(code, theme);

      await bot.sendPhoto(msg.chat.id, imageBuffer, {
        caption: `✅ *Berhasil!*\n*Tema:* ${theme.toUpperCase()}`,
        parse_mode: "Markdown"
      });

      await bot.deleteMessage(msg.chat.id, proses.message_id);

    } catch (err) {
      console.error(err);
      await bot.sendMessage(msg.chat.id, "❌ Gagal memproses gambar.");
    }
  },
};

