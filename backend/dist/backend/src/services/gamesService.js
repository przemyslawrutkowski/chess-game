import GamesRepository from "../repositories/gamesRepository.js";
import PoolService from "../services/poolService.js";
import ServerGame from "../models/ServerGame.js";
import ChessService from "../services/ChessService.js";
import Move from "../../../shared/src/models/Move.js";
import Position from "../../../shared/src/models/Position.js";
import { GameState } from "../../../shared/src/enums/GameState.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";
import PawnPromotion from "../../../shared/src/models/PawnPromotion.js";
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
        if (this.poolService.getPoolSize() < 2)
            return false;
        const user1 = this.poolService.shiftUser();
        const user2 = this.poolService.shiftUser();
        if (!user1 || !user2)
            return false;
        const chessboard = this.chessService.initilizeChessboard(user1, user2);
        const game = new ServerGame(user1, user2, chessboard);
        return this.gamesRepository.addGame(game);
    }
    getGameState(socketId) {
        const game = this.gamesRepository.getGameState(socketId);
        if (game)
            return game;
        return null;
    }
    removeGame(socketId) {
        return this.gamesRepository.removeGame(socketId);
    }
    getOpponentSocketId(socketId) {
        const game = this.getGameState(socketId);
        if (!game)
            return null;
        const user1SocketId = game.getUser1().getSocketId();
        const user2SocketId = game.getUser2().getSocketId();
        return socketId === user1SocketId ? user2SocketId : user1SocketId;
    }
    getGameSocketIds(socketId) {
        const game = this.getGameState(socketId);
        if (!game)
            return null;
        const user1SocketId = game.getUser1().getSocketId();
        const user2SocketId = game.getUser2().getSocketId();
        return [user1SocketId, user2SocketId];
    }
    validateTurn(socketId) {
        const game = this.getGameState(socketId);
        if (!game)
            return false;
        return game.getCurrentOrWinningPlayer()?.getSocketId() === socketId;
    }
    moveChessPiece(socketId, moveType, move) {
        const game = this.getGameState(socketId);
        if (!game)
            return null;
        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const chessboard = game.getChessboard();
        let reconstructedMove = new Move(oldPosition, newPosition);
        if (moveType === MoveType.PawnPromotion) {
            reconstructedMove = new PawnPromotion(oldPosition, newPosition, move.newMovementStrategy);
        }
        const scoreIncrease = this.chessService.makeMove(moveType, reconstructedMove, chessboard);
        game.increaseScore(scoreIncrease);
        if (reconstructedMove instanceof PawnPromotion)
            this.chessService.promotePawn(newPosition, reconstructedMove.getNewMovementStrategy(), chessboard);
        const gameState = this.chessService.checkGameState(socketId, chessboard);
        game.updateCurrentPlayerOrWinner(gameState);
        const currentOrWinningPlayer = game.getCurrentOrWinningPlayer();
        if (gameState === GameState.Checkmate || gameState === GameState.Stalemate) {
            if (!this.removeGame(socketId))
                throw new Error('We could not remove the game');
        }
        let moveData = { oldPosition: move.oldPosition, newPosition: move.newPosition };
        if (moveType === MoveType.PawnPromotion) {
            moveData = { oldPosition: move.oldPosition, newPosition: move.newPosition, newMovementStrategy: move.newMovementStrategy };
        }
        else if (moveType === MoveType.EnPassant) {
            moveData = { oldPosition: move.oldPosition, newPosition: move.newPosition, enPassantPosition: move.enPassantPosition };
        }
        const moveResult = {
            move: moveData,
            score: game.getClientScore(),
            currentOrWinningPlayer: currentOrWinningPlayer ? currentOrWinningPlayer.getClientUser() : null,
            gameState: gameState
        };
        return moveResult;
    }
    classifyMove(socketId, move) {
        const game = this.getGameState(socketId);
        if (!game)
            return MoveType.Invalid;
        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const chessboard = game.getChessboard();
        const isTurnValid = this.validateTurn(socketId);
        const isMoveValid = this.chessService.isMoveValid(socketId, oldPosition, newPosition, chessboard);
        if (!isTurnValid || !isMoveValid)
            MoveType.Invalid;
        const isPawnPromotionMove = this.chessService.isPawnPromotionMove(oldPosition, newPosition, chessboard);
        if (isPawnPromotionMove)
            return MoveType.PawnPromotion;
        const isEnPassantMove = this.chessService.isEnPassantMove(oldPosition, newPosition, chessboard);
        if (isEnPassantMove)
            return MoveType.EnPassant;
        return MoveType.Move;
    }
}
