export default class MoveResult {
    move;
    score;
    currentOrWinningPlayer;
    gameState;
    constructor(move, score, currentOrWinningPlayer, gameState) {
        this.move = move;
        this.score = score;
        this.currentOrWinningPlayer = currentOrWinningPlayer;
        this.gameState = gameState;
    }
    getMove() {
        return this.move;
    }
    getScore() {
        return this.score;
    }
    getCurrentOrWinningPlayer() {
        return this.currentOrWinningPlayer;
    }
    getGameState() {
        return this.gameState;
    }
}
