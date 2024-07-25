import ChessPiece from "./ChessPiece.js";
export default class ChessPieceWithFirstMove extends ChessPiece {
    isFirstMove;
    constructor(user, movementStrategy) {
        super(user, movementStrategy);
        this.isFirstMove = true;
    }
    getIsFirstMove() {
        return this.isFirstMove;
    }
    setIsFirstMove(isFirstMove) {
        this.isFirstMove = isFirstMove;
    }
}
