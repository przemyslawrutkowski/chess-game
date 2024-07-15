export default class GamesRepository {
    static instance;
    games;
    constructor() {
        this.games = [];
    }
    static getInstance() {
        if (!GamesRepository.instance) {
            GamesRepository.instance = new GamesRepository();
        }
        return GamesRepository.instance;
    }
    addGame(game) {
        const user1SocketId = game.getUser1().getSocketId();
        const user2SocketId = game.getUser2().getSocketId();
        const userAlreadyPlaying = this.games.some(g => g.getUser1().getSocketId() === user1SocketId ||
            g.getUser1().getSocketId() === user2SocketId ||
            g.getUser2().getSocketId() === user1SocketId ||
            g.getUser2().getSocketId() === user2SocketId);
        if (!userAlreadyPlaying) {
            this.games.push(game);
            return true;
        }
        return false;
    }
    removeGame(socketId) {
        const index = this.games.findIndex(g => g.getUser1().getSocketId() === socketId ||
            g.getUser2().getSocketId() === socketId);
        if (index !== -1) {
            this.games.splice(index, 1);
            return true;
        }
        return false;
    }
    getGameState(socketId) {
        return this.games.find(g => g.getUser1().getSocketId() === socketId ||
            g.getUser2().getSocketId() === socketId);
    }
}
