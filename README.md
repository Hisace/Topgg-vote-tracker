[![Discord](https://img.shields.io/badge/Discord_server-7289DA?style=for-the-badge)](https://discord.gg/W7zen4gGbv)
![MIT License](https://img.shields.io/badge/MIT-green?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

# Discord Bot Vote Tracker

This repository provides a way to track your Discord bot votes on [Top.gg](https://top.gg/) using **Discord.js**, **Sequelize**, and **Express.js**. It listens for webhook events from Top.gg when a user votes for your bot and stores the vote details in a MySQL database.

## Features
- Listens for vote webhooks from Top.gg.
- Stores vote data, including vote streaks and total votes.
- Sends an embed message in a designated Discord channel when a user votes.
- Uses Sequelize ORM for easy database management.
- Built with **Node.js**, **Express.js**, and **Discord.js v14**.

## Installation
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [MySQL](https://www.mysql.com/)
- A Discord bot with the necessary permissions
- A [Top.gg webhook](https://docs.top.gg/resources/webhooks/) set up

### 1. Clone the repository
```bash
git clone https://github.com/Hisace/Topgg-vote-tracker.git
cd Topgg-vote-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root and add the following variables:
```env
TOKEN=your_discord_bot_token
TOPGG_WEBHOOK_AUTH=your_topgg_webhook_secret
DB_NAME=your_database_name
DB_USER=your_database_username
DB_PASS=your_database_password
DB_HOST=your_database_host
VOTE_CHANNEL_ID=your_vote_channel_id
PORT=3000
```

### 4. Set up the database
Ensure your MySQL database is running, then sync the Sequelize models:
```bash
node index.js
```

### 5. Start the bot
```bash
node index.js
```

## Usage
### Top.gg Webhook Endpoint
The webhook listens for votes at the following endpoint:
```
POST /dblwebhook
```
Make sure to set this endpoint in your bot's Top.gg settings.

### Discord Embed Message
Whenever a user votes, an embed message is sent in the configured vote channel, showing:
- Voter information
- Vote type
- Current vote streak
- Total votes
- Time until the next vote is allowed

## Contributing
Feel free to fork this repository, submit issues, or contribute improvements!

## License
This project is licensed under the [MIT License](LICENSE).

