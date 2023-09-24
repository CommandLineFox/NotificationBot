import type { CommandInteraction } from "discord.js";
import type { BotClient } from "../../../../core/BotClient";
import Subcommand from "../../../../command/Subcommand";

export default class NotificationMessageSet extends Subcommand {
    public constructor() {
        super("set", "Set the notification message, use [mention] for mentions and [url] for where link will be");
        this.data.addStringOption(option =>
            option.setName("message")
                .setDescription("Message to display")
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

        const message = interaction.options.getString("message", true);
        if (guild.notification && guild.notification.message === message) {
            await interaction.reply({ content: "The notification message is already set to that.", ephemeral: true });
            return;
        }

        await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.message": message } });
        await interaction.reply(`The notification message has been set to:\n${message}`);
    }
}
