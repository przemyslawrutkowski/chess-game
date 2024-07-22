import Position from "./Position.js";
import Move from "./Move.js";

export default class EnPassant extends Move {
    private enPassantPosition: Position;

    constructor(oldPosition: Position, newPosition: Position, enPassantPosition: Position) {
        super(oldPosition, newPosition);
        this.enPassantPosition = enPassantPosition;
    }

    public getEnPassantPosition() {
        return this.enPassantPosition;
    }
}