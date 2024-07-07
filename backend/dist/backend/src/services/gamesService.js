import GamesRepository from "../repositories/gamesRepository.js";
import PoolService from "../services/poolService.js";
import ServerGame from "../models/ServerGame.js";
import ChessService from "../services/ChessService.js";
export default class GamesService {
    static instance;
    gamesRepository;
    poolService;
    chessService;
    constructor() {
        this.gamesRepository = GamesRepository.getInstance();
        this.poolService = PoolService.getInstance();
        this.chessService = ChessService.getInstance();
    }
    static getInstance() {
        if (!GamesService.instance) {
            GamesService.instance = new GamesService();
        }
        return GamesService.instance;
    }
    matchUsers() {
        const poolSize = this.poolService.getPoolSize();
        if (poolSize < 2)
            return null;
        const user1 = this.poolService.shiftUser();
        const user2 = this.poolService.shiftUser();
        if (user1 && user2) {
            const chessboard = this.chessService.initilizeChessboard(user1, user2);
            const game = new ServerGame(user1, user2, chessboard);
            const result = this.gamesRepository.addGame(game);
            if (result)
                return game;
        }
        return null;
    }
    getGameState(socketId) {
        const game = this.gamesRepository.getGameState(socketId);
        if (game)
            return game;
        return null;
    }
}
