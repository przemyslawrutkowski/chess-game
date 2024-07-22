import ChessPiece from "./ChessPiece.js";
export default class Pawn extends ChessPiece {
    isFirstMove;
    wasPreviousMoveDouble;
    constructor(user, movementStrategy) {
        super(user, movementStrategy);
        this.isFirstMove = true;
        this.wasPreviousMoveDouble = false;
    }
    getIsFirstMove() {
        return this.isFirstMove;
    }
    setIsFirstMove(isFirstMove) {
        this.isFirstMove = isFirstMove;
    }
    getWasPreviousMoveDouble() {
        return this.wasPreviousMoveDouble;
    }
    setWasPreviousMoveDouble(wasPreviousMoveDouble) {
        this.wasPreviousMoveDouble = wasPreviousMoveDouble;
    }
}
