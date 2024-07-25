import ChessPieceWithFirstMove from "./ChessPieceWithFirstMove.js";
export default class Pawn extends ChessPieceWithFirstMove {
    wasPreviousMoveDouble;
    constructor(user, movementStrategy) {
        super(user, movementStrategy);
        this.wasPreviousMoveDouble = false;
    }
    getWasPreviousMoveDouble() {
        return this.wasPreviousMoveDouble;
    }
    setWasPreviousMoveDouble(wasPreviousMoveDouble) {
        this.wasPreviousMoveDouble = wasPreviousMoveDouble;
    }
}
