import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import ClientUser from "./ClientUser.js";

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

    getClientUser(): ClientUser {
        return new ClientUser(this.username, this.color);
    }
}