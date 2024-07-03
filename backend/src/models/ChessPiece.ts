import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import ServerUser from "./ServerUser.js";
import ClientUser from "./ClientUser.js";
import crypto from 'crypto';

export default class ChessPiece {
    private id: string;
    private user: ServerUser | ClientUser;
    private movementStrategy: MovementStrategy;

    constructor(user: ServerUser | ClientUser, movementStrategy: MovementStrategy) {
        this.user = user;
        this.movementStrategy = movementStrategy;
        this.id = crypto.randomUUID();
    }

    public getId(): string {
        return this.id;
    }

    public getUser(): ServerUser | ClientUser {
        return this.user;
    }

    public getMovementStrategy(): MovementStrategy {
        return this.movementStrategy;
    }
}