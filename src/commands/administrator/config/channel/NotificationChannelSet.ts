import { ChannelType, CommandInteraction } from "discord.js";
import type { BotClient } from "../../../../core/BotClient";
import Subcommand from "../../../../command/Subcommand";

export default class NotificationChannelSet extends Subcommand {
    public constructor() {
        super("set", "Set the channel to accept verifications in");
        this.data.addChannelOption(option =>
            option.setName("channel")
                .setDescription("Choose the channel for sending notifications")
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

        const channel = interaction.options.getChannel("channel", true);
        if (guild.notification?.channel === channel.id) {
            await interaction.reply({ content: "The channel for sending notifications has already been set to the same channel.", ephemeral: true });
            return;
        }

        if (channel.type !== ChannelType.GuildText) {
            await interaction.reply({ content: "The channel for sending notifications can only be a text channel.", ephemeral: true })
            return;
        }

        await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.channel": channel.id } });
        await interaction.reply(`The channel for sending notifications has been set to <#${channel.id}>.`);
    }
}
