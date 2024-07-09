export default class ChessMoveOutCome {
    moveType;
    scoreIncrease;
    capturedPieceId;
    constructor(moveType, scoreIncrease, capturedPieceId) {
        this.moveType = moveType;
        this.scoreIncrease = scoreIncrease;
        this.capturedPieceId = capturedPieceId;
    }
    getMoveType() {
        return this.moveType;
    }
    getScoreIncrease() {
        return this.scoreIncrease;
    }
    getCapturedPieceId() {
        return this.capturedPieceId;
    }
}
