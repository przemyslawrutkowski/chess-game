import { MovementStrategy } from "../enums/MovementStrategy.js";
import ServerUser from "./ServerUser.js";
import ClientUser from "./ClientUser.js";

export default class ChessPiece {
    private user: ServerUser | ClientUser;
    private movementStrategy: MovementStrategy;

    constructor(user: ServerUser | ClientUser, movementStrategy: MovementStrategy) {
        this.user = user;
        this.movementStrategy = movementStrategy;
    }

    getUser(): ServerUser | ClientUser {
        return this.user;
    }

    getMovementStrategy(): MovementStrategy {
        return this.movementStrategy;
    }
}