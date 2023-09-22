import { TextChannel } from "discord.js";
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

                if (!guild?.notification.channel) {
                    continue;
                }

                const channel = await client.channels.fetch(guild?.notification.channel)
                if (!channel) {
                    continue;
                }

                const url = await checkNewVideo(client)
                if (!url) {
                    continue;
                }

                if (guild.notification.last === url) {
                    continue;
                }

                let role = "";
                if (guild.notification.role) {
                    role = `<@&${guild.notification.role}>`
                }

                await (channel as TextChannel).send(`New video! ${url} ${role}`)
                await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.last": url } });
            }
        }, 10000);
    }
}