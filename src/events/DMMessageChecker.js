const { Events } = require("discord.js");
const moment = require("moment");

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute: async (message) => {
        if (message.guild) return;
        console.log(
            `[${moment().format("DD-MM-YYYY HH:mm:ss")}] Der Bot hat eine DM von ` +
            message.author.username +
            ` erhalten mit Inhalt '` +
            message.content +
            `'!`
        );
    },
};
