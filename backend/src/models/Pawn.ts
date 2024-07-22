import ChessPiece from "./ChessPiece.js";
import ServerUser from "./ServerUser.js";
import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";

export default class Pawn extends ChessPiece {
    private isFirstMove: boolean;
    private wasPreviousMoveDouble: boolean;

    constructor(user: ServerUser, movementStrategy: MovementStrategy) {
        super(user, movementStrategy);
        this.isFirstMove = true;
        this.wasPreviousMoveDouble = false;
    }

    public getIsFirstMove(): boolean {
        return this.isFirstMove;
    }

    public setIsFirstMove(isFirstMove: boolean): void {
        this.isFirstMove = isFirstMove;
    }

    public getWasPreviousMoveDouble(): boolean {
        return this.wasPreviousMoveDouble;
    }

    public setWasPreviousMoveDouble(wasPreviousMoveDouble: boolean): void {
        this.wasPreviousMoveDouble = wasPreviousMoveDouble;
    }
}