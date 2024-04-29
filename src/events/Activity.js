let { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: false,
  execute: async (client) => {
    setInterval(async () => {
      try {
        const url = await fetch("https://api.laut.fm/station/synradiode/current_song");
        if (url.ok) {
          let RadioData = await url.json();

          client.user.setPresence({
            activities: [
              {
                name: `🎺 ${RadioData.title + " von " + RadioData.artist.name || "Akutell Spielt kein Song!"}`,
                type: ActivityType.Custom,
              },
            ],
            status: `🎺 ${RadioData.title + " von " + RadioData.artist.name || "Akutell Spielt kein Song!"}`,
          });
        }
      } catch (err) {
        return err;
      }
    }, 3500);
  },
};
