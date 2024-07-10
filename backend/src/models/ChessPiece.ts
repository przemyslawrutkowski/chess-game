import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import ServerUser from "./ServerUser.js";
import crypto from 'crypto';

export default class ChessPiece {
    private id: string;
    private user: ServerUser;
    private movementStrategy: MovementStrategy;
    private isFirstMove: boolean;

    constructor(user: ServerUser, movementStrategy: MovementStrategy, isFirstMove: boolean = false) {
        this.user = user;
        this.movementStrategy = movementStrategy;
        this.id = crypto.randomUUID();
        this.isFirstMove = isFirstMove;
    }

    public getId(): string {
        return this.id;
    }

    public getUser(): ServerUser {
        return this.user;
    }

    public getMovementStrategy(): MovementStrategy {
        return this.movementStrategy;
    }

    public getIsFirstMove(): boolean {
        return this.isFirstMove;
    }

    public setIsFirstMove(isFirstMove: boolean): void {
        this.isFirstMove = isFirstMove;
    }
}