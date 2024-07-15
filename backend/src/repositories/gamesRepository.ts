import ServerGame from "../models/ServerGame.js";

export default class GamesRepository {
    private static instance: GamesRepository;
    public games: ServerGame[];

    private constructor() {
        this.games = [];
    }

    public static getInstance(): GamesRepository {
        if (!GamesRepository.instance) {
            GamesRepository.instance = new GamesRepository();
        }
        return GamesRepository.instance;
    }

    public addGame(game: ServerGame): boolean {
        const user1SocketId = game.getUser1().getSocketId();
        const user2SocketId = game.getUser2().getSocketId();

        const userAlreadyPlaying = this.games.some(g =>
            g.getUser1().getSocketId() === user1SocketId ||
            g.getUser1().getSocketId() === user2SocketId ||
            g.getUser2().getSocketId() === user1SocketId ||
            g.getUser2().getSocketId() === user2SocketId
        );
        if (!userAlreadyPlaying) {
            this.games.push(game);
            return true;
        }
        return false;
    }

    public removeGame(socketId: string): boolean {
        const index = this.games.findIndex(g =>
            g.getUser1().getSocketId() === socketId ||
            g.getUser2().getSocketId() === socketId
        );
        if (index !== -1) {
            this.games.splice(index, 1);
            return true;
        }
        return false;
    }

    public getGameState(socketId: string): ServerGame | undefined {
        return this.games.find(g =>
            g.getUser1().getSocketId() === socketId ||
            g.getUser2().getSocketId() === socketId
        );
    }
}