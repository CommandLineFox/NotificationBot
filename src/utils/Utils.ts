import type { BotClient } from "../core/BotClient";
import axios from 'axios';
import { Guild } from "../models/Guild";

export async function checkNewVideo(client: BotClient, guild: Guild): Promise<string | null> {
    try {
        const apiKey = client.config.api;
        const url = guild.notification?.url;

        if (!url) {
            console.log("No url set");
            return null;
        }

        let uploadsPlaylistId = guild.notification?.playlist

        if (!uploadsPlaylistId) {
            // Getting the Uploads playlist ID for the Channel
            const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${url}&part=contentDetails`);
            uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

            if (!uploadsPlaylistId) {
                console.log("No uploads playlist found for channel", url);
                return null;
            }

            // Store the uploadsPlaylistId in the Guild model
            await client.database.guilds.updateOne({ id: guild.id }, { "$set": { "notification.playlist": uploadsPlaylistId } });
        }

        // Retrieve the most recent video from the Uploads playlist
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=1&order=date`);

        const videoId = response.data.items[0]?.snippet?.resourceId?.videoId;
        if (!videoId) {
            return null;
        }

        return `https://www.youtube.com/watch?v=${videoId}`;
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return null;
    }
}