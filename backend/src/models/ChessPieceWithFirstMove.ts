import ChessPiece from "./ChessPiece.js";
import ServerUser from "./ServerUser.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";

export default class ChessPieceWithFirstMove extends ChessPiece {
    protected isFirstMove: boolean;

    constructor(user: ServerUser, movementStrategy: MovementStrategy) {
        super(user, movementStrategy);
        this.isFirstMove = true;
    }

    public getIsFirstMove(): boolean {
        return this.isFirstMove;
    }

    public setIsFirstMove(isFirstMove: boolean): void {
        this.isFirstMove = isFirstMove;
    }
}