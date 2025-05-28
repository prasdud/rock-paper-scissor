const PendingGame = require('../models/PendingGame');
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");


const decideWinner = (p1Move, p2Move) => {
    if (p1Move === p2Move) return 'draw';
    if (
        (p1Move === 'rock' && p2Move === 'scissors') ||
        (p1Move === 'scissors' && p2Move === 'paper') ||
        (p1Move === 'paper' && p2Move === 'rock')
    ) {
        return 'player1';
    } else {
        return 'player2';
    }
};

/*
*Need to integrate interact.js inside here so gameController directly writes the rounds to blockchain
*need to replace all the files from rps-hardhat
*/

async function syncToChain(game) {
    
    console.log("Storing a game result...");
    const storeTx = await contract.storeGameResult(
        game.gameId,
        game.player1,
        game.player2,
        game.rounds,
        game.winner,
        game.isSyncedToChain = true,
        //game.p1Move,
        //game.p2Move,
    );



    //maybe redundant??
    if (game.isSyncedToChain == true) {
        console.log("Game synced to blockchain...");
        return true
    }

    if (game.isSyncedToChain == false) {
        console.log("Game NOT SYNCED to blockchain...");
        return false
    }
}


// core game logic
/**
 * right now game logic does work, but it keeps writing to the same gameID after 3 rounds, need to 
 * implement a check before creating new game or writing, not a concern righ not
 */
exports.handleGameLogic = async (req, res) => {
    const { gameId, player1, player2, player1Move, player2Move } = req.body;

    try {
        let game = await PendingGame.findOne({ gameId });

        if (!game) {
            game = new PendingGame({
                gameId,
                player1,
                player2,
                rounds: [],
                winner: null,
                isSyncedToChain: false
            });
        }

        const roundWinner = decideWinner(player1Move, player2Move);

        game.rounds.push({
            player1Move,
            player2Move,
            roundWinner
        });

        if (game.rounds.length === 3) {
            const player1Wins = game.rounds.filter(round => round.roundWinner === 'player1').length;
            const player2Wins = game.rounds.filter(round => round.roundWinner === 'player2').length;

            if (player1Wins > player2Wins) {
                game.winner = 'player1';
            } else if (player2Wins > player1Wins) {
                game.winner = 'player2';
            } else {
                game.winner = 'draw';
            }

            syncToChain(game);
            // Later: game.isSyncedToChain = true;
        }

        await game.save();

        res.status(201).json({
            message: `Round submitted successfully. Current round winner: ${roundWinner}`,
            game: game
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//module.exports = rpsContract;