import { ChannelType, TextBasedChannel } from "discord.js";
import type { BotClient } from "../core/BotClient";
import Event from "../event/Event";
import { checkNewVideo } from "../utils/Utils";

export default class Ready extends Event {
    public constructor() {
        super("ready");
    }

    public async callback(client: BotClient): Promise<void> {
        console.log(`Logged in as ${client.user?.tag}`);

        client.interval = setInterval(async () => {
            const cursor = client.database.guilds.find();

            while (await cursor.hasNext()) {
                const guild = await cursor.next();
                if (!guild?.notification?.enabled) {
                    continue;
                }

                if (!guild.notification.url) {
                    continue;
                }

                let channel;
                if (guild.notification.guide === true && guild.notification.guidechannel) {
                    channel = await client.channels.fetch(guild?.notification.guidechannel);
                } else if (guild.notification.channel) {
                    channel = await client.channels.fetch(guild?.notification.channel);
                }

                if (!channel) {
                    continue;
                }

                const url = await checkNewVideo(client, guild);
                if (!url) {
                    continue;
                }

                if (guild.notification.last === url) {
                    continue;
                }

                let role = "";
                if (guild.notification.ping === "everyone") {
                    role = "@everyone";
                } else if (guild.notification.role) {
                    role = `<@&${guild.notification.role}>`;
                }

                let text = `New video! ${url} ${role}`;
                if (guild.notification.message) {
                    text = guild.notification.message.replace("[url]", url).replace("[mention]", role);
                }

                const message = await (channel as TextBasedChannel).send(text);

                if (channel.type === ChannelType.AnnouncementThread) {
                    message.crosspost()
                }

                await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.last": url } });
            }
        }, 15000);
    }
}
