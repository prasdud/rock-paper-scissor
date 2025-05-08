var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const { type } = require('express/lib/response');

const pendingGameSchema = new mongoose.Schema({
    // i know i should just name them player 1 and player 2, unlike the bible, goliath might win here

    david: {
        type: String,
        required: true
    },

    goliath: {
        type: String,
        required: true
    },

    davidsMove: {
        type: String,
        required: true
    },
    
    goliathsMove: {
        type: String,
        required: true
    },

    winner: {
        type: String,
        required: true
    },

    isSyncedToChain: {
        type: Boolean,
        default: false,
        required: true
    }
}, {timestamps: true});



const PendingGame = mongoose.model('PendingGame', pendingGameSchema);
module.exports = PendingGame;