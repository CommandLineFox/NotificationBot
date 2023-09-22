import type { BotClient } from "../core/BotClient";
import axios from 'axios';

export async function checkNewVideo(client: BotClient): Promise<string | null> {
    try {
        const apiKey = client.config.api;
        const url = client.config.url;

        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${url}&part=snippet,id&order=date&maxResults=1`
        );

        const videoId = response.data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return null;
    }
}