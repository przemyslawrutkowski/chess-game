import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import ServerUser from "./ServerUser.js";
import crypto from 'crypto';

export default class ChessPiece {
    protected id: string;
    protected user: ServerUser;
    protected movementStrategy: MovementStrategy;

    constructor(user: ServerUser, movementStrategy: MovementStrategy) {
        this.user = user;
        this.movementStrategy = movementStrategy;
        this.id = crypto.randomUUID();
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

    public setMovementStrategy(movementStrategy: MovementStrategy): void {
        this.movementStrategy = movementStrategy;
    }
}