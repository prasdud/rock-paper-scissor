var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const pendingGameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
    },
    
    player1: {
        type: String,
        required: true
    },

    player2: {
        type: String,
        required: true
    },

    rounds: [
        {
            player1Move: {
                type: String,
                enum: ['rock', 'paper', 'scissors'],
                required: true
            },
            player2Move: {
                type: String,
                enum: ['rock', 'paper', 'scissors'],
                required: true
            },
            roundWinner: {
                type: String,
                required: true
            }
        }
    ],
    
    winner: {
        type: String,
        required: function() { return this.rounds.length === 3; } // Winner is required only when there are 3 rounds
    },

    isSyncedToChain: {
        type: Boolean,
        default: false,
        required: true
    }
}, {timestamps: true});

const PendingGame = mongoose.model('PendingGame', pendingGameSchema);
module.exports = PendingGame;
