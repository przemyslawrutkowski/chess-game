import Move from "./Move.js";
export default class Castling extends Move {
    rookOldPosition;
    rookNewPosition;
    constructor(oldPosition, newPosition, rookOldPosition, rookNewPosition) {
        super(oldPosition, newPosition);
        this.rookOldPosition = rookOldPosition;
        this.rookNewPosition = rookNewPosition;
    }
    getRookOldPosition() {
        return this.rookOldPosition;
    }
    getRookNewPosition() {
        return this.rookNewPosition;
    }
}
