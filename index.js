const express = require('express');
const { Webhook } = require("@top-gg/sdk");
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { Sequelize } = require('sequelize');
require('dotenv').config();
const token = process.env.TOKEN;
const dbConfig = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
};

const app = express();
const PORT = process.env.PORT || 3000;

const TOPGG_WEBHOOK_AUTH = process.env.TOPGG_WEBHOOK_AUTH;
const VOTE_CHANNEL_ID = process.env.VOTE_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    logging: false,
  });

module.exports.sequelize = sequelize;

// Sync Sequelize models with the database
(async () => {
    try {
        await sequelize.sync({ alter: true }); // This syncs the models with the database, altering the tables if necessary
        console.log('Sequelize models synchronized with the database.');
    } catch (error) {
        console.error('Error syncing Sequelize models:', error);
    }
  })();

const Vote = require('./models/Vote');

const webhook = new Webhook(TOPGG_WEBHOOK_AUTH);

// Webhook endpoint
app.post("/dblwebhook", webhook.listener(async (vote) => {
    
    if (vote && vote.user) {
        const userId = vote.user;
        const voteChannel = client.channels.cache.get(VOTE_CHANNEL_ID);
        const now = new Date();

        // Find the user's last vote
        const lastVote = await Vote.findOne({ where: { userId: userId } });

        let voteStreak = 1;
        let totalVotes = 1;

        if (lastVote) {
            const timeDifference = now - new Date(lastVote.timestamp);
            const hoursDifference = timeDifference / (1000 * 60 * 60);

            totalVotes = lastVote.totalVotes + 1;

            if (hoursDifference <= 24) {
                voteStreak = lastVote.voteStreak + 1;
            }
        }

        // Upsert the vote to the database
        await Vote.upsert({
            userId: vote.user,
            botId: vote.bot,
            type: vote.type,
            timestamp: now,
            voteStreak: voteStreak,
            lastVotedAt: now,
            totalVotes: totalVotes,
        });

        if (voteChannel) {
            const nextVoteTime = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours later

            const voteEmbed = new EmbedBuilder()
                .setColor('#46e855')
                .setTitle('New Vote Received!')
                .setDescription(`Thank you <@${userId}> for voting for <@${vote.bot}> !`)
                .addFields(
                    { name: 'User ID', value: userId, inline: true },
                    { name: 'Bot ID', value: vote.bot, inline: true },
                    { name: 'Type', value: vote.type, inline: true },
                    { name: 'Current Vote Streak', value: voteStreak.toString(), inline: true },
                    { name: 'Total Votes', value: totalVotes.toString(), inline: true },
                    { name: 'Can vote again', value: `<t:${Math.floor(nextVoteTime.getTime() / 1000)}:R>`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'Thanks for your support!' });

            voteChannel.send({ content: `<@${userId}>`, embeds: [voteEmbed] });
        }
    }
}));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Log in to Discord
client.login(token);

