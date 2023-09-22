import type { CommandInteraction } from "discord.js";
import type { BotClient } from "../../../../core/BotClient";
import Subcommand from "../../../../command/Subcommand";

export default class NotificationRoleRemove extends Subcommand {
    public constructor() {
        super("remove", "Remove the notification role");
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

        if (!guild.notification?.role) {
            await interaction.reply({ content: "The notification role has not been set yet.", ephemeral: true });
            return;
        }

        await client.database.guilds.updateOne({ id: guild.id }, { "$unset": { "notification.role": "" } });
        await interaction.reply(`The notification role has been removed.`);
    }
}
