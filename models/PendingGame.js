var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const pendingGameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true
    },
    
    david: {
        type: String,
        required: true
    },

    goliath: {
        type: String,
        required: true
    },

    rounds: [
        {
            davidsMove: {
                type: String,
                enum: ['rock', 'paper', 'scissors'],
                required: true
            },
            goliathsMove: {
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
