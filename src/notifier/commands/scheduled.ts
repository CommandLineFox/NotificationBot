import { Command, CommandOptionsRunTypeEnum } from '@sapphire/framework';
import {MessageFlags, TextChannel, Role, PermissionFlagsBits} from 'discord.js';
import { GuildService } from '../../services/guildService';
import { CustomResponse } from '../../types/customResponse';

export class ScheduledCommand extends Command {
    private guildService = new GuildService();

    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            name: 'scheduled',
            description: 'Manage scheduled alerts for the current YouTube channel',
            detailedDescription: 'Enable/disable scheduled stream alerts, set the Discord channel, or set the mention role.',
            runIn: CommandOptionsRunTypeEnum.GuildText,
            preconditions: ['UptimeCheck'],
            requiredUserPermissions: PermissionFlagsBits.ManageGuild
        });
    }

    public override registerApplicationCommands(registry: Command.Registry): void {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addSubcommand(cmd =>
                    cmd.setName('enabled')
                        .setDescription('Enable or disable scheduled stream alerts')
                        .addBooleanOption(opt =>
                            opt.setName('value')
                                .setDescription('Enable (true) or disable (false)')
                                .setRequired(true)))
                .addSubcommand(cmd =>
                    cmd.setName('channel')
                        .setDescription('Set the Discord channel for scheduled stream alerts')
                        .addChannelOption(opt =>
                            opt.setName('value')
                                .setDescription('Discord channel')
                                .setRequired(true)))
                .addSubcommand(cmd =>
                    cmd.setName('role')
                        .setDescription('Set the mention role for scheduled stream alerts')
                        .addRoleOption(opt =>
                            opt.setName('value')
                                .setDescription('Role to mention')
                                .setRequired(true)))
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction): Promise<void> {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const currentId = await this.guildService.getCurrentChannel(interaction.guildId!);
        if (!currentId) {
            await interaction.editReply({ content: 'No current channel set. Use `/channel current` first.' });
            return;
        }

        let result: CustomResponse = { success: false, message: 'Unknown subcommand.' };

        switch (interaction.options.getSubcommand()) {
            case 'enabled': {
                const value = interaction.options.getBoolean('value', true);
                result = await this.guildService.setScheduleEnabled(interaction.guildId!, currentId, value);
                break;
            }
            case 'channel': {
                const channel = interaction.options.getChannel('value', true) as TextChannel;
                result = await this.guildService.setScheduleDiscordChannelId(interaction.guildId!, currentId, channel.id);
                break;
            }
            case 'role': {
                const role = interaction.options.getRole('value', true) as Role;
                result = await this.guildService.setScheduleMentionRoleId(interaction.guildId!, currentId, role.id);
                break;
            }
        }

        await interaction.editReply({ content: result.message });
    }
}