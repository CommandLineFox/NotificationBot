import type { CommandInteraction } from "discord.js";
import type { BotClient } from "../../../../core/BotClient";
import Subcommand from "../../../../command/Subcommand";

export default class NotificationUrlSet extends Subcommand {
    public constructor() {
        super("set", "Set the url of the channel");
        this.data.addStringOption(option =>
            option.setName("url")
                .setDescription("Url of the channel")
                .setRequired(true)
        )
    }

    async execute(interaction: CommandInteraction, client: BotClient): Promise<void> {
        if (!interaction.guild || !interaction.isChatInputCommand()) {
            return;
        }

        const guild = await client.database.getGuild(interaction.guild.id);
        if (!guild) {
            await interaction.reply({ content: "There was an error while trying to reach the database.", ephemeral: true });
            return;
        }

        const url = interaction.options.getString("url", true);
        if (guild.notification && guild.notification.url === url) {
            await interaction.reply({ content: "The channel url is already set to that.", ephemeral: true });
            return;
        }

        await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.url": url } });
        await interaction.reply(`The channel url has been set to **${url}**.`);
    }
}
