export default class MoveResult {
    oldPostion;
    newPosition;
    score;
    currentOrWinningPlayer;
    gameState;
    newMovementStrategy;
    constructor(oldPostion, newPosition, score, currentOrWinningPlayer, gameState, newMovementStrategy) {
        this.oldPostion = oldPostion;
        this.newPosition = newPosition;
        this.score = score;
        this.currentOrWinningPlayer = currentOrWinningPlayer;
        this.gameState = gameState;
        this.newMovementStrategy = newMovementStrategy;
    }
    getOldPosition() {
        return this.oldPostion;
    }
    getNewPosition() {
        return this.newPosition;
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
    getNewMovementStrategy() {
        return this.newMovementStrategy;
    }
}
