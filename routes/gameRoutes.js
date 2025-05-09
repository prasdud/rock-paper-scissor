const express = require('express');
const router = express.Router();
const PendingGame = require('../models/PendingGame');

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

// core game logic
router.post('/gameLogic', async (req, res) => {
    const { gameId, player1, player2, player1Move, player2Move } = req.body;

    try {
        let game = await PendingGame.findOne({ gameId });

        if (!game) {
            // if no game exists, create a new one
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

        // Check if 3 rounds have been played (best of 3 rounds)
        if (game.rounds.length === 3) {
            const player1Wins = game.rounds.filter(round => round.roundWinner === 'player1').length;
            const player2Wins = game.rounds.filter(round => round.roundWinner === 'player2').length;

            // overall winner of the game
            if (player1Wins > player2Wins) {
                game.winner = 'player1';
            } else if (player2Wins > player1Wins) {
                game.winner = 'player2';
            } else {
                game.winner = 'draw'; // shouldn't normally happen in a best-of-3
            }

            // set isSyncedToChain to true when syncing to the blockchain
            // game.isSyncedToChain = true;
        }

        await game.save();

        res.status(201).json({
            message: `Round submitted successfully. Current round winner: ${roundWinner}`,
            game: game
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
