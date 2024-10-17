const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

const FRIEND_USERNAME = ''; // Replace with your friend's unique Discord username
const SOUND_FILE = path.join(__dirname, 'dasd.mp3'); // Path to your sound file

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Fetch the user by username
    const guilds = client.guilds.cache;
    for (const guild of guilds.values()) {
        const member = await guild.members.fetch({ query: FRIEND_USERNAME, limit: 1 });
        const friend = member.find(m => m.user.username === FRIEND_USERNAME);
        if (friend) {
            global.FRIEND_ID = friend.id;
            console.log(`Found friend: ${friend.user.tag}`);
            break;
        }
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (global.FRIEND_ID && newState.member.id === global.FRIEND_ID && !oldState.channel && newState.channel) {
        try {
            setTimeout(() => {
                const connection = joinVoiceChannel({
                    channelId: newState.channel.id,
                    guildId: newState.guild.id,
                    adapterCreator: newState.guild.voiceAdapterCreator,
                });
            
                const player = createAudioPlayer();
                const resource = createAudioResource(SOUND_FILE);

                player.play(resource);
                connection.subscribe(player);

                player.on(AudioPlayerStatus.Idle, () => {
                    connection.destroy();
                });

                player.on('error', error => {
                    console.error('Error playing audio:', error);
                });
            }, 5000); // 5-second delay

        } catch (error) {
            console.error('Error joining voice channel:', error);
        }
    }
});

client.login('bot_key');