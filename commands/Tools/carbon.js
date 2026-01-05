import axios from "axios";

const rawThemes = [
  "3024 night","A11y dark","Blackboard","Base16 dark","Base16 light",
  "Cobalt","Dracula","Dracula pro","Duotone dark","Hopscotch","Lucario",
  "Material","Monokai","Night owl","Nord","Oceanic next","One dark",
  "One light","Panda syntax","Paraiso dark","Seti","Shades of purple",
  "Solarized dark","Solarized light","Synthwave '84","Twilight",
  "Verminal","Vscode","Yeti","Zenburn"
];

const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const themeMap = Object.fromEntries(rawThemes.map(t => [normalize(t), t]));

function detectLanguage(code) {
  if (/^\s*</.test(code)) return "html";
  if (/console\.log|require\(|import /.test(code)) return "javascript";
  if (/def |print\(/.test(code)) return "python";
  if (/System\.out\.println|public static void/.test(code)) return "java";
  return "auto";
}

async function generate(code, theme, language, preset) {
  let size = { widthAdjustment: true, paddingHorizontal: "48px", paddingVertical: "48px" };
  if (preset === "mobile") size = { widthAdjustment: false, paddingHorizontal: "24px", paddingVertical: "48px" };
  if (preset === "story") size = { widthAdjustment: false, paddingHorizontal: "32px", paddingVertical: "96px" };

  const res = await axios.post("https://carbonara.solopov.dev/api/cook", {
    code, language, theme,
    backgroundColor: "#1F2937",
    dropShadow: true,
    windowControls: true,
    lineNumbers: true,
    ...size
  }, { responseType: "arraybuffer", timeout: 30000 });

  return Buffer.from(res.data);
}

export default {
  name: "carbon",
  execute: async ({ bot, msg }) => {
    const help = `🎨 *CARBON*\n\nFormat:\n/carbon tema,preset|kode\n\nContoh:\n/carbon nightowl,story|console.log("Hello")`;

    const input = msg.text.split(" ").slice(1).join(" ");
    if (!input) return bot.sendMessage(msg.chat.id, help, { parse_mode: "Markdown" });

    let meta = "dracula,desktop", code = input;
    if (input.includes("|")) [meta, code] = input.split("|");

    let [inputTheme, preset] = meta.split(",");
    const theme = themeMap[normalize(inputTheme || "")] || "Dracula";
    preset = ["desktop","mobile","story"].includes(preset) ? preset : "desktop";

    let language = detectLanguage(code);
    try { code = JSON.stringify(JSON.parse(code), null, 2); language = "json"; } catch {}

    const loading = await bot.sendMessage(msg.chat.id, "⏳ Generating...", { parse_mode: "Markdown" });
    const image = await generate(code, theme, language, preset);

    await bot.sendPhoto(msg.chat.id, image, {
      caption: `🎨 ${theme} | 🧩 ${language} | 📐 ${preset}`,
      parse_mode: "Markdown"
    });

    await bot.deleteMessage(msg.chat.id, loading.message_id);
  }
};
