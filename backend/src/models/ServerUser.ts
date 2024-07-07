import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import { UserDTO } from "../../../shared/src/interfaces/DTO.js";

export default class ServerUser {
    private socketId: string;
    private username: string;
    private color?: PlayerColor;

    constructor(username: string, socketId: string) {
        this.socketId = socketId;
        this.username = username;
    }

    getSocketId(): string {
        return this.socketId;
    }

    getUsername(): string {
        return this.username;
    }

    getColor(): PlayerColor | undefined {
        return this.color;
    }

    setColor(color: PlayerColor): void {
        this.color = color;
    }

    getClientUser(): UserDTO {
        return { username: this.username, color: this.color! };
    }
}