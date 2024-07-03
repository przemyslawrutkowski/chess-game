import Position from "./Position.js";

export default class Move {
    private chessPieceId: string;
    private oldPosition: Position;
    private newPosition: Position;

    constructor(chessPieceId: string, oldPosition: Position, newPosition: Position) {
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