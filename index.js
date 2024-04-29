let { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
let client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
  shards: "auto",
});

let config = require("./CONFIGS/config.json");
let { readdirSync } = require("node:fs");

let BotlistMeClient = require("botlist.me.js");
let MEBotList = new BotlistMeClient(config.generell.botlist, client);

setInterval(async () => {
  MEBotList.on("posted", () => {});

  MEBotList.on("error", (err) => {
    console.log("6) Ein Fehler ist aufgetreten! Code: " + err);
  });
}, 43200000);

module.exports = client;

let token = config.generell.bot_token;

client.commandaliases = new Collection();
client.commands = new Collection();
client.slashcommands = new Collection();
client.slashdatas = [];

let slashcommands = [];
readdirSync("./src/commands/SlashCommands").forEach(async (file) => {
  let command = await require(`./src/commands/SlashCommands/${file}`);
  client.slashdatas.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
});

readdirSync("./src/events").forEach(async (file) => {
  let event = await require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

process.on("unhandledRejection", (err) => {
  console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] 1) Code: ` + err);
});

process.on("uncaughtException", (err) => {
  console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] 2) Code: ` + err);
});

process.on("uncaughtExceptionMonitor", (err) => {
  console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] 3) Code: ` + err);
});

client.login(token);
