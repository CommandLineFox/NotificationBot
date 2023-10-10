import type { CommandInteraction } from "discord.js";
import type { BotClient } from "../../../core/BotClient";
import Subcommand from "../../../command/Subcommand";

export default class NotificationPing extends Subcommand {
    public constructor() {
        super("ping", "Toggle ping type");
        this.data.addStringOption(option =>
            option.setName("toggle")
                .setDescription("Option")
                .addChoices({ name: "Everyone", value: "everyone" }, { name: "Role", value: "role" })
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
            case "everyone": {
                if (guild.notification?.ping === "everyone") {
                    await interaction.reply({ content: "The ping is already set to everyone.", ephemeral: true });
                    return;
                }

                await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.ping": option } });
                await interaction.reply("The ping has been set to everyone.");
                break;
            }

            case "role": {
                if (guild.notification?.ping === "role") {
                    await interaction.reply({ content: "The ping is already set to role.", ephemeral: true });
                    return;
                }

                await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.ping": option } });
                await interaction.reply("The ping has been set to role.");
                break;
            }
        }
    }
}
