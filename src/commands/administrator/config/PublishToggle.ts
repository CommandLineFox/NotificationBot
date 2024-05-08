import type { CommandInteraction } from "discord.js";
import type { BotClient } from "../../../core/BotClient";
import Subcommand from "../../../command/Subcommand";

export default class NotificationToggle extends Subcommand {
    public constructor() {
        super("publish", "Toggle publishing notifications");
        this.data.addStringOption(option =>
            option.setName("toggle")
                .setDescription("Option")
                .addChoices({ name: "Enable", value: "enable" }, { name: "Disable", value: "disable" })
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

        const option = interaction.options.getString("toggle", true);
        switch (option.toLowerCase()) {
            case "enable": {
                if (guild.notification?.publish === true) {
                    await interaction.reply({ content: "Publishing is already enabled.", ephemeral: true });
                    return;
                }

                await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.publish": true } });
                await interaction.reply("Publishing has been enabled.");
                break;
            }

            case "disable": {
                if (guild.notification?.publish !== true) {
                    await interaction.reply({ content: "Publishing is already disabled.", ephemeral: true });
                    return;
                }

                await client.database.guilds.updateOne({ id: guild.id }, { "$unset": { "notification.publish": "" } });
                await interaction.reply("Publishing has been disabled.");
                break;
            }
        }
    }
}
