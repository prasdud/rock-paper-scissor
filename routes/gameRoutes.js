const express = require('express');
const router = express.Router();
const PendingGame = require('../models/PendingGame');

// Decide the winner of the round
const decideWinner = (p1Move, p2Move) => {
    if (p1Move === p2Move) return 'draw';
    if (
        (p1Move === 'rock' && p2Move === 'scissors') ||
        (p1Move === 'scissors' && p2Move === 'paper') ||
        (p1Move === 'paper' && p2Move === 'rock')
    ) {
        return 'david';
    } else {
        return 'goliath';
    }
};

// Main game logic route
router.post('/gameLogic', async (req, res) => {
    const { gameId, david, goliath, davidsMove, goliathsMove } = req.body;

    try {
        let game = await PendingGame.findOne({ gameId });

        if (!game) {
            // If no game exists, create a new one
            game = new PendingGame({
                gameId,
                david,
                goliath,
                rounds: [],
                winner: null,
                isSyncedToChain: false
            });
        }

        // Decide the winner of the current round
        const roundWinner = decideWinner(davidsMove, goliathsMove);

        // Add the round result to the rounds array
        game.rounds.push({
            davidsMove,
            goliathsMove,
            roundWinner
        });

        // Check if 3 rounds have been played (best of 3 rounds)
        if (game.rounds.length === 3) {
            const davidWins = game.rounds.filter(round => round.roundWinner === 'david').length;
            const goliathWins = game.rounds.filter(round => round.roundWinner === 'goliath').length;

            // Determine the overall winner of the game
            if (davidWins > goliathWins) {
                game.winner = 'david';
            } else if (goliathWins > davidWins) {
                game.winner = 'goliath';
            } else {
                game.winner = 'draw'; // This case shouldn't normally happen in a best-of-3
            }

            // Optionally, here you can set isSyncedToChain to true when syncing to the blockchain
            // game.isSyncedToChain = true;
        }

        await game.save();

        // Send the response with the current game state
        res.status(201).json({
            message: `Round submitted successfully. Current round winner: ${roundWinner}`,
            game: game
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

module.exports = router;
