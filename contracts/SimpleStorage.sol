// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // Struct to store game data
    struct GameResult {
        address player1;
        address player2;
        string move1;
        string move2;
        string winner;
        uint256 timestamp;
    }

    // Array to store game results
    GameResult[] public gameResults;

    // Event to log when a game result is stored
    event GameResultStored(
        uint256 indexed gameId, 
        address player1, 
        address player2, 
        string move1, 
        string move2, 
        string winner
    );

    // Function to store a game result
    function storeGameResult(
        address _player1, 
        address _player2, 
        string memory _move1, 
        string memory _move2, 
        string memory _winner
    ) public returns (uint256) {
        // Create a new GameResult
        GameResult memory newResult = GameResult({
            player1: _player1,
            player2: _player2,
            move1: _move1,
            move2: _move2,
            winner: _winner,
            timestamp: block.timestamp
        });

        // Add to the array and get the game ID (index)
        gameResults.push(newResult);
        uint256 gameId = gameResults.length - 1;

        // Emit an event
        emit GameResultStored(gameId, _player1, _player2, _move1, _move2, _winner);

        return gameId;
    }

    // Function to retrieve a specific game result
    function getGameResult(uint256 _gameId) public view returns (
        address player1, 
        address player2, 
        string memory move1, 
        string memory move2, 
        string memory winner,
        uint256 timestamp
    ) {
        require(_gameId < gameResults.length, "Game result does not exist");
        
        GameResult memory result = gameResults[_gameId];
        return (
            result.player1, 
            result.player2, 
            result.move1, 
            result.move2, 
            result.winner,
            result.timestamp
        );
    }

    // Function to get total number of stored game results
    function getGameResultsCount() public view returns (uint256) {
        return gameResults.length;
    }
}