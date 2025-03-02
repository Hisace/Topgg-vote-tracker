const { DataTypes } = require('sequelize');
const { sequelize } = require('../index.js');

const Vote = sequelize.define('Vote', {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
    },
    botId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    voteStreak: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
    },
    lastVotedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
}, {
    timestamps: false,
});

module.exports = Vote;