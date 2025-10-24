export default {
  name: "ping",
  category: "Tools",
  description: "Cek respon bot",
  owner: false,
  admin: false,
  execute: async ({ bot, msg }) => {
    await bot.sendMessage(msg.chat.id, "🏓 Pong! bot prettttttt onlien ");
  },

};


