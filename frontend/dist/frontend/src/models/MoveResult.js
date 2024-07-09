export default class MoveResult {
    chessPieceId;
    oldPostion;
    newPosition;
    moveType;
    score;
    whoseTurn;
    capturedPieceId;
    constructor(chessPieceId, oldPostion, newPosition, moveType, score, whoseTurn, capturedPieceId) {
        this.chessPieceId = chessPieceId;
        this.oldPostion = oldPostion;
        this.newPosition = newPosition;
        this.moveType = moveType;
        this.score = score;
        this.whoseTurn = whoseTurn;
        this.capturedPieceId = capturedPieceId;
    }
    getChessPieceId() {
        return this.chessPieceId;
    }
    getOldPosition() {
        return this.oldPostion;
    }
    getNewPosition() {
        return this.newPosition;
    }
    getMoveType() {
        return this.moveType;
    }
    getScore() {
        return this.score;
    }
    getWhoseTurn() {
        return this.whoseTurn;
    }
    getCapturedPieceId() {
        return this.capturedPieceId;
    }
}
