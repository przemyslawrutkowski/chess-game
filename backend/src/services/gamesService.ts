import GamesRepository from "../repositories/gamesRepository.js";
import PoolService from "../services/poolService.js";
import ServerGame from "../models/ServerGame.js";
import ChessService from "../services/ChessService.js";
import Move from "../../../shared/src/models/Move.js";
import { MoveResultDTO, MoveDTO, PawnPromotionDTO, EnPassantDTO, PositionDTO, CastlingDTO } from "../../../shared/src/interfaces/DTO.js";
import Position from "../../../shared/src/models/Position.js";
import { GameState } from "../../../shared/src/enums/GameState.js";
import { MoveType } from "../../../shared/src/enums/MoveType.js";
import PawnPromotion from "../../../shared/src/models/PawnPromotion.js";
import { MoveStatus } from "../enums/MoveStatus.js";

export default class GamesService {
    private static instance: GamesService;
    private gamesRepository: GamesRepository;
    private poolService: PoolService;
    private chessService: ChessService;

    private constructor() {
        this.gamesRepository = GamesRepository.getInstance();
        this.poolService = PoolService.getInstance();
        this.chessService = ChessService.getInstance();
    }

    public static getInstance(): GamesService {
        if (!GamesService.instance) {
            GamesService.instance = new GamesService();
        }
        return GamesService.instance;
    }

    public matchUsers(): boolean {
        if (this.poolService.getPoolSize() < 2) return false;

        const user1 = this.poolService.shiftUser();
        const user2 = this.poolService.shiftUser();
        if (!user1 || !user2) throw new Error("Failed to retrieve two users from the pool.");

        const chessboard = this.chessService.initilizeChessboard(user1, user2);
        const game = new ServerGame(user1, user2, chessboard);

        const result = this.gamesRepository.addGame(game);
        if (!result) throw new Error("Failed to add game to the repository.");
        return result;
    }

    public getGameState(socketId: string): ServerGame | null {
        const game = this.gamesRepository.getGameState(socketId);
        if (game) return game;
        return null;
    }

    public removeGame(socketId: string): boolean {
        return this.gamesRepository.removeGame(socketId);
    }

    public getOpponentSocketId(socketId: string): string | null {
        const game = this.getGameState(socketId);
        if (!game) return null;
        const user1SocketId = game.getUser1().getSocketId();
        const user2SocketId = game.getUser2().getSocketId();
        return socketId === user1SocketId ? user2SocketId : user1SocketId;
    }

    public getGameSocketIds(socketId: string): [string, string] | null {
        const game = this.getGameState(socketId);
        if (!game) return null;
        const user1SocketId = game.getUser1().getSocketId();
        const user2SocketId = game.getUser2().getSocketId();
        return [user1SocketId, user2SocketId];
    }

    private validateTurn(socketId: string): boolean {
        const game = this.getGameState(socketId);
        if (!game) throw new Error("Cannot validate turn. Game not found.");
        return game.getCurrentOrWinningPlayer()?.getSocketId() === socketId;
    }

    public moveChessPiece(socketId: string, moveType: MoveType, move: MoveDTO): MoveResultDTO | null {
        const game = this.getGameState(socketId);
        if (!game) throw new Error("Operation failed: Game associated with the provided socket ID does not exist.");

        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const chessboard = game.getChessboard();

        let reconstructedMove: Move | PawnPromotion = new Move(oldPosition, newPosition);
        if (moveType === MoveType.PawnPromotion) {
            reconstructedMove = new PawnPromotion(oldPosition, newPosition, (move as PawnPromotionDTO).newMovementStrategy);
        }

        let moveData: MoveDTO | PawnPromotionDTO | EnPassantDTO | CastlingDTO = { oldPosition: move.oldPosition, newPosition: move.newPosition };
        if (moveType === MoveType.PawnPromotion) {
            moveData = { oldPosition: move.oldPosition, newPosition: move.newPosition, newMovementStrategy: (move as PawnPromotionDTO).newMovementStrategy };
        } else if (moveType === MoveType.EnPassant) {
            const enPassantMove = this.chessService.isEnPassantMove(oldPosition, newPosition, chessboard);
            if (!enPassantMove) throw new Error("Operation failed: Unable to retrieve en passant move.");
            const enPassantPosition: PositionDTO = { x: enPassantMove.getEnPassantPosition().getX(), y: enPassantMove.getEnPassantPosition().getY() };
            moveData = { oldPosition: move.oldPosition, newPosition: move.newPosition, enPassantPosition: enPassantPosition };
        } else if (moveType === MoveType.Castling) {
            const castlingMove = this.chessService.isCastlingMove(oldPosition, newPosition, chessboard);
            if (!castlingMove) throw new Error("Operation failed: Unable to retrieve castling move.");
            const rookOldPosition: PositionDTO = { x: castlingMove.getRookOldPosition().getX(), y: castlingMove.getRookOldPosition().getY() };
            const rookNewPosition: PositionDTO = { x: castlingMove.getRookNewPosition().getX(), y: castlingMove.getRookNewPosition().getY() };
            moveData = { oldPosition: move.oldPosition, newPosition: move.newPosition, rookOldPosition: rookOldPosition, rookNewPosition: rookNewPosition };
        }

        const scoreIncrease = this.chessService.makeMove(moveType, reconstructedMove, chessboard);
        game.increaseScore(scoreIncrease);
        game.setMoveStatus(MoveStatus.Completed);

        if (reconstructedMove instanceof PawnPromotion) this.chessService.promotePawn(newPosition, reconstructedMove.getNewMovementStrategy(), chessboard);

        const gameState: GameState = this.chessService.checkGameState(socketId, chessboard);
        game.updateCurrentPlayerOrWinner(gameState);

        const currentOrWinningPlayer = game.getCurrentOrWinningPlayer();

        if (gameState === GameState.Checkmate || gameState === GameState.Stalemate || gameState === GameState.Draw) {
            if (!this.removeGame(socketId)) throw new Error("Operation failed: Unable to remove the completed game.");
        }

        const moveResult: MoveResultDTO = {
            move: moveData,
            score: game.getClientScore(),
            currentOrWinningPlayer: currentOrWinningPlayer ? currentOrWinningPlayer.getClientUser() : null,
            gameState: gameState
        };

        return moveResult;
    }

    public classifyMove(socketId: string, move: MoveDTO): MoveType {
        const game = this.getGameState(socketId);
        if (!game) return MoveType.Invalid;

        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const chessboard = game.getChessboard();

        const isTurnValid = this.validateTurn(socketId);
        const isMoveValid = this.chessService.isMoveValid(socketId, oldPosition, newPosition, chessboard);
        const moveStatus = game.getMoveStatus();

        if (!isTurnValid || !isMoveValid || moveStatus === MoveStatus.InProgress) return MoveType.Invalid;

        const isPawnPromotionMove = this.chessService.isPawnPromotionMove(oldPosition, newPosition, chessboard);
        if (isPawnPromotionMove) {
            game.setMoveStatus(MoveStatus.InProgress);
            return MoveType.PawnPromotion;
        }

        const isEnPassantMove = this.chessService.isEnPassantMove(oldPosition, newPosition, chessboard);
        if (isEnPassantMove) return MoveType.EnPassant;

        const isCastlingMove = this.chessService.isCastlingMove(oldPosition, newPosition, chessboard);
        if (isCastlingMove) return MoveType.Castling;

        return MoveType.Move;
    }
}