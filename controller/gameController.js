const PendingGame = require("../models/PendingGame");
const contract = require("../utils/blockchain");

const decideWinner = (p1Move, p2Move) => {
    if (p1Move === p2Move) return 'draw';
    if (
        (p1Move === 'rock' && p2Move === 'scissors') ||
        (p1Move === 'scissors' && p2Move === 'paper') ||
        (p1Move === 'paper' && p2Move === 'rock')
    ) return 'player1';
    return 'player2';
};

async function syncToChain(game) {
    try {
        console.log("Storing game result on-chain...");

        const lastRound = game.rounds[game.rounds.length - 1];

        const tx = await contract.storeGameResult(
            game.player1,
            game.player2,
            lastRound.player1Move,
            lastRound.player2Move,
            game.winner
        );

        await tx.wait();

        game.isSyncedToChain = true;
        await game.save();

        console.log("✅ Game synced to blockchain.");
        return true;
    } catch (err) {
        console.error("❌ Blockchain sync failed:", err.message);
        return false;
    }
}


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

        if (game.rounds.length >= 3) {
            return res.status(400).json({ message: "Game already completed." });
        }

        const roundWinner = decideWinner(player1Move, player2Move);

        game.rounds.push({ player1Move, player2Move, roundWinner });

        if (game.rounds.length === 3) {
            const p1Wins = game.rounds.filter(r => r.roundWinner === 'player1').length;
            const p2Wins = game.rounds.filter(r => r.roundWinner === 'player2').length;

            game.winner = p1Wins > p2Wins ? 'player1' : p2Wins > p1Wins ? 'player2' : 'draw';

            await syncToChain(game); // await is crucial
        }

        await game.save();

        res.status(201).json({
            message: `Round submitted. Winner: ${roundWinner}`,
            game
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
