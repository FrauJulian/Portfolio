let { EmbedBuilder } = require("discord.js");
let { SlashCommandBuilder } = require("@discordjs/builders");
let config = require("../../../CONFIGS/config.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("stats")
	.setDescription("🎺 | Siehe generelle Stats vom Bot als auch vom Web Radio!"),
    run: async (client, interaction) => {
        let embed_author_text = config.radio_embed_theme.embed_author_text;
        let embed_author_icon = config.radio_embed_theme.embed_author_icon;
        let embed_footer_text = config.radio_embed_theme.embed_footer_text;
        let embed_footer_icon = config.radio_embed_theme.embed_footer_icon;
        let embed_color = config.radio_embed_theme.embed_color;

        let Data = await fetch("https://api.laut.fm/station/synradiode/listeners");
        if(Data.ok) {
            let listenersData = await Data.json();
            let Data1 = await fetch("https://api.laut.fm/station/synradiode/current_song");
            if(Data1.ok) {
                let SongData = await Data1.json();

                let HilfeEmbed = new EmbedBuilder()
                .setAuthor({ name: embed_author_text + "STATS", iconURL: embed_author_icon })
                .setDescription("[LautFM](https://laut.fm/synradiode) | [Webseite](https://synradio.de/) | [Impressum](https://synradio.de/impressum.html)\nKontaktiere uns unter `Support@SynRadio.de`!\n## Die wichtigsten Stats!")
                .addFields(
                    { name: "DC Server", value: `${client.guilds.cache.size}`, inline: true  },
                    { name: "DC Nutzer", value: `${client.users.cache.size}`, inline: true  },
                    { name: "DC Verbindungen", value: `${client.voice.adapters.size}`, inline: true  },
                    { name: "Web-Radio Verbindungen", value: `${listenersData}`, inline: true  },
                    { name: "aktueller Song", value: `${SongData.title + " von " + SongData.artist.name || "Akutell Spielt kein Song!"}`, inline: true  }
                )
                .setTimestamp()
                .setFooter({ text: embed_footer_text, iconURL: embed_footer_icon })
                .setColor(embed_color)
                interaction.reply({ embeds: [HilfeEmbed], ephemeral: true });
            }
        } else (err) => {
            console.log(err)

            let embed_author_text = config.fehler_embed.embed_author_text;
            let embed_author_icon = config.fehler_embed.embed_author_icon;
            let embed_description = config.fehler_embed.embed_description.replace("%error%", "" + err + "");
            let embed_footer_text = config.fehler_embed.embed_footer_text;
            let embed_footer_icon = config.fehler_embed.embed_footer_icon;
            let embed_color = config.fehler_embed.embed_color;
    
            let ErrEmbed = new EmbedBuilder()
            .setAuthor({ name: embed_author_text, iconURL: embed_author_icon })
            .setDescription(embed_description)
            .setTimestamp()
            .setFooter({ text: embed_footer_text, iconURL: embed_footer_icon })
            .setColor(embed_color)
            interaction.reply({ embeds: [ErrEmbed], ephemeral: true})
          };
    }
}
