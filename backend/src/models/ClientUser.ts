import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";

export default class ClientUser {
    private username: string;
    private color?: PlayerColor;

    constructor(username: string, color?: PlayerColor) {
        this.username = username;
        this.color = color;
    }

    getUsername(): string {
        return this.username;
    }

    getColor(): PlayerColor | undefined {
        return this.color;
    }
}