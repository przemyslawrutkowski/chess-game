export default class MoveData {
    chessPieceId;
    position;
    constructor(chessPieceId, position) {
        this.chessPieceId = chessPieceId;
        this.position = position;
    }
    getChessPieceId() {
        return this.chessPieceId;
    }
    getPosition() {
        return this.position;
    }
}
