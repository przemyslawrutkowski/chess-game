import Move from "./Move.js";
export default class EnPassant extends Move {
    enPassantPosition;
    constructor(oldPosition, newPosition, enPassantPosition) {
        super(oldPosition, newPosition);
        this.enPassantPosition = enPassantPosition;
    }
    getEnPassantPosition() {
        return this.enPassantPosition;
    }
}
