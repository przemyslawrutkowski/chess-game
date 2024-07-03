export default class Move {
    chessPieceId;
    oldPosition;
    newPosition;
    constructor(chessPieceId, oldPosition, newPosition) {
        this.chessPieceId = chessPieceId;
        this.oldPosition = oldPosition;
        this.newPosition = newPosition;
    }
    getChessPieceId() {
        return this.chessPieceId;
    }
    getOldPosition() {
        return this.oldPosition;
    }
    getNewPosition() {
        return this.newPosition;
    }
}
