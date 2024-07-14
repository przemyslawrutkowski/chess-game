import GamesRepository from "../repositories/gamesRepository.js";
import PoolService from "../services/poolService.js";
import ServerGame from "../models/ServerGame.js";
import ChessService from "../services/ChessService.js";
import Move from "../../../shared/src/models/Move.js";
import Position from "../../../shared/src/models/Position.js";
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
    validateTurn(socketId) {
        const game = this.getGameState(socketId);
        if (!game)
            return false;
        return game.getWhoseTurn().getSocketId() === socketId;
    }
    moveChessPiece(socketId, move) {
        const game = this.getGameState(socketId);
        if (!game)
            return null;
        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const reconstructedMove = new Move(oldPosition, newPosition);
        const chessboard = game.getChessboard();
        const isTurnValid = this.validateTurn(socketId);
        const isMoveValid = this.chessService.isMoveValid(socketId, oldPosition, newPosition, chessboard);
        if (!isTurnValid || !isMoveValid)
            return null;
        const scoreIncrease = this.chessService.moveChessPiece(reconstructedMove, chessboard);
        game.increaseScore(scoreIncrease);
        game.switchTurn();
        const gameState = this.chessService.checkGameState(socketId, chessboard);
        console.log(gameState);
        const moveResult = {
            oldPostion: move.oldPosition,
            newPosition: move.newPosition,
            score: game.getClientScore(),
            whoseTurn: game.getWhoseTurn().getClientUser(),
            gameState: gameState
        };
        return moveResult;
    }
}
