import Command from "../../../command/Command";
import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import type { BotClient } from "../../../core/BotClient";

export default class Notification extends Command {
    public constructor() {
        super("config", "Configuring sending notifications", undefined, PermissionFlagsBits.Administrator);
    }

    async execute(interaction: CommandInteraction, client: BotClient): Promise<void> {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const group = interaction.options.getSubcommandGroup() ?? "";
        const subcommand = this.subcommands.get(this.data.name + " " + group + " " + interaction.options.getSubcommand()) ?? this.subcommands.get(this.data.name + " " + interaction.options.getSubcommand());
        if (!subcommand) {
            await interaction.reply({ content: "I was unable to find the command.", ephemeral: true });
            return;
        }

        subcommand.execute(interaction, client);
    }
}
