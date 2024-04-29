const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require("../../../CONFIGS/config.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("hilfe")
	.setDescription("🎺 | Brauchst du Hilfe?"),
    run: async (client, interaction) => {
        let embed_author_text = config.radio_embed_theme.embed_author_text;
        let embed_author_icon = config.radio_embed_theme.embed_author_icon;
        let embed_footer_text = config.radio_embed_theme.embed_footer_text;
        let embed_footer_icon = config.radio_embed_theme.embed_footer_icon;
        let embed_color = config.radio_embed_theme.embed_color;

        var HilfeEmbed = new EmbedBuilder()
        .setAuthor({ name: embed_author_text + "HILFE", iconURL: embed_author_icon })
        .setDescription("[LautFM](https://laut.fm/synradiode) | [Webseite](https://synradio.de/) | [Impressum](https://synradio.de/impressum.html)\nKontaktiere uns unter `Support@SynRadio.de`!\n## Du brauchst Hilfe?")
        .addFields(
            { name: "/Radio", value: "Starte den Radio für die beste Laune!", inline: true  },
            { name: "/Stop", value: "Stoppe den Radio für die schlechteste Laune!", inline: true  },
            { name: "/Stats", value: "Siehe die aktuellen Stats des Radio's ein.", inline: true  },
        )
        .setTimestamp()
        .setFooter({ text: embed_footer_text, iconURL: embed_footer_icon })
        .setColor(embed_color)
        return interaction.reply({ embeds: [HilfeEmbed], ephemeral: true });
    }
}
