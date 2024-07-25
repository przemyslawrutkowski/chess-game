import Position from "./Position.js";
import Move from "./Move.js";

export default class Castling extends Move {
    private rookOldPosition: Position;
    private rookNewPosition: Position;

    constructor(oldPosition: Position, newPosition: Position, rookOldPosition: Position, rookNewPosition: Position) {
        super(oldPosition, newPosition);
        this.rookOldPosition = rookOldPosition;
        this.rookNewPosition = rookNewPosition;
    }

    public getRookOldPosition() {
        return this.rookOldPosition;
    }

    public getRookNewPosition() {
        return this.rookNewPosition;
    }
}