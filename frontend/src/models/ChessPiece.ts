import { MovementStrategy } from "../../../shared/src/enums/MovementStrategy.js";
import ClientUser from "./ClientUser.js";

export default class ChessPiece {
    private id: string;
    private user: ClientUser;
    private movementStrategy: MovementStrategy;

    constructor(id: string, user: ClientUser, movementStrategy: MovementStrategy) {
        this.id = id;
        this.user = user;
        this.movementStrategy = movementStrategy;
    }

    public getId(): string {
        return this.id;
    }

    public getUser(): ClientUser {
        return this.user;
    }

    public getMovementStrategy(): MovementStrategy {
        return this.movementStrategy;
    }

    public setMovementStrategy(movementStrategy: MovementStrategy): void {
        this.movementStrategy = movementStrategy;
    }
}