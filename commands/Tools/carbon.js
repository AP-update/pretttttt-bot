import axios from "axios";

async function generateCarbonImage(code, theme, language, preset) {
  const CONFIG = {
    API_URL: "https://carbonara.solopov.dev/api/cook",
    UA: "Mozilla/5.0",
    TIMEOUT: 30000
  };

  let size = {
    widthAdjustment: true,
    paddingHorizontal: "48px",
    paddingVertical: "48px"
  };

  if (preset === "mobile") {
    size = { widthAdjustment: false, paddingHorizontal: "24px", paddingVertical: "48px" };
  }

  if (preset === "story") {
    size = { widthAdjustment: false, paddingHorizontal: "32px", paddingVertical: "96px" };
  }

  const payload = {
    code,
    language,
    theme,
    backgroundColor: "#1F2937",
    dropShadow: true,
    windowControls: true,
    lineNumbers: true,
    ...size
  };

  const res = await axios.post(CONFIG.API_URL, payload, {
    headers: { "User-Agent": CONFIG.UA },
    responseType: "arraybuffer",
    timeout: CONFIG.TIMEOUT
  });

  return Buffer.from(res.data);
}

function detectLanguage(code) {
  if (/^\s*</.test(code)) return "html";
  if (/console\.log|require\(|import /.test(code)) return "javascript";
  if (/def |print\(|import /.test(code)) return "python";
  if (/public static void|System\.out\.println/.test(code)) return "java";
  if (/#include <|std::/.test(code)) return "cpp";
  return "auto";
}

export default {
  name: "carbon",
  category: "Tools",
  description: "Ubah kode jadi gambar estetik 🎨",
  execute: async ({ bot, msg }) => {

    const themes = ["blackboard","cobalt","dracula","hopscotch","lucario","material","monokai","nord","seti","twilight","verminal","vscode","yeti","zenburn"];
    const presets = ["desktop","mobile","story"];

    const help = `🎨 *CARBON*\n\nFormat:\n\`/carbon tema,preset|kode\`\n\nTema:\n${themes.join(", ")}\n\nPreset:\n${presets.join(", ")}\n\nContoh:\n\`/carbon monokai,story|console.log("Hi")\``;

    try {
      const input = msg.text.split(" ").slice(1).join(" ");
      if (!input) return bot.sendMessage(msg.chat.id, help, { parse_mode: "Markdown" });

      let meta = "dracula,desktop";
      let code = input;

      if (input.includes("|")) [meta, code] = input.split("|");

      let [theme, preset] = meta.toLowerCase().split(",");
      theme = themes.includes(theme) ? theme : "dracula";
      preset = presets.includes(preset) ? preset : "desktop";

      let language = detectLanguage(code);

      try {
        const json = JSON.parse(code);
        code = JSON.stringify(json, null, 2);
        language = "json";
      } catch {}

      const loading = await bot.sendMessage(
        msg.chat.id,
        `⏳ Generating • ${theme} • ${language} • ${preset}`,
        { parse_mode: "Markdown" }
      );

      const image = await generateCarbonImage(code, theme, language, preset);

      await bot.sendPhoto(msg.chat.id, image, {
        caption: `✅ *Success*\n🎨 ${theme} | 🧩 ${language} | 📐 ${preset}`,
        parse_mode: "Markdown"
      });

      await bot.deleteMessage(msg.chat.id, loading.message_id);

    } catch (e) {
      console.error(e);
      bot.sendMessage(msg.chat.id, "❌ Error membuat gambar.");
    }
  }
};
