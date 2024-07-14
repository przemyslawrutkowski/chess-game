export default class MoveResult {
    oldPostion;
    newPosition;
    score;
    whoseTurn;
    constructor(oldPostion, newPosition, score, whoseTurn) {
        this.oldPostion = oldPostion;
        this.newPosition = newPosition;
        this.score = score;
        this.whoseTurn = whoseTurn;
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
    getWhoseTurn() {
        return this.whoseTurn;
    }
}
