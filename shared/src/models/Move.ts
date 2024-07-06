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

    public getChessPieceId() {
        return this.chessPieceId;
    }

    public getOldPosition() {
        return this.oldPosition;
    }

    public getNewPosition() {
        return this.newPosition;
    }
}