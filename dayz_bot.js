const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const token = 'discord token';
const serverId = 'serverid';
const channelId = 'channel id'; // The ID of the channel where you want to post the message

client.once('ready', () => {
    console.log('Bot is online!');

    // Function to fetch and post server info
    const postServerInfo = async () => {
        try {
            const response = await axios.get(`https://api.battlemetrics.com/servers/${serverId}`);
            const playerCount = response.data.data.attributes.players;
            const channel = client.channels.cache.get(channelId);
            if (channel) {
                channel.send(`There are currently ${playerCount} players on the server.`);
            } else {
                console.error('Channel not found');
            }
        } catch (error) {
            console.error('Error fetching server data:', error);
        }
    };

    // Post server info immediately and then every 5 minutes
    postServerInfo();
    setInterval(postServerInfo, 5 * 60 * 1000); // 5 minutes in milliseconds
});

client.login(token);