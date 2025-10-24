export default {
  name: "joke",
  category: "Fun",
  description: "Ambil joke acak dari API",
  owner: false,
  admin: false,
  execute: async ({ bot, msg, fetch }) => {
    try {
      const res = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
      const data = await res.json();
      await bot.sendMessage(msg.chat.id, `😂 Joke: ${data.joke}`);
    } catch {
      await bot.sendMessage(msg.chat.id, "❌ Gagal ambil joke.");
    }
  },
};