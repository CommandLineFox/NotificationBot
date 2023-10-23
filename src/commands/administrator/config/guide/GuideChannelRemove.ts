import type { CommandInteraction } from "discord.js";
import type { BotClient } from "../../../../core/BotClient";
import Subcommand from "../../../../command/Subcommand";

export default class GuideChannelRemove extends Subcommand {
    public constructor() {
        super("remove", "Remove the channel to send guide notifications in");
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

        if (!guild.notification?.guidechannel) {
            await interaction.reply({ content: "The channel to send guide notifications in has not been set yet.", ephemeral: true });
            return;
        }

        await client.database.guilds.updateOne({ id: guild.id }, { "$unset": { "notification.guidechannel": "" } });
        await interaction.reply("The channel to send guide notifications in has been removed.");
    }
}
