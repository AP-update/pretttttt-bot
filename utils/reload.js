import fs from "fs";
import path from "path";
import url from "url";

export async function reloadCommands(commandsFolder = "./commands") {
  const commands = {};
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const folderPath = path.join(__dirname, "..", commandsFolder);

  const readFolder = async (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        await readFolder(path.join(dir, file.name));
      } else if (file.name.endsWith(".js")) {
        try {
          const cmdPath = path.join(dir, file.name);
          
          const cmd = await import(cmdPath + `?update=${Date.now()}`); 
          if (cmd.default && cmd.default.name) {
            const name = cmd.default.name.toLowerCase();
            commands[name] = cmd.default;
            console.log(`✅ Command loaded: ${name}`);
          }
        } catch (e) {
          console.error("❌ Error loading command:", file.name, e);
        }
      }
    }
  };

  await readFolder(folderPath);
  console.log(`🔄 Total commands loaded: ${Object.keys(commands).length}`);
  return commands;
}