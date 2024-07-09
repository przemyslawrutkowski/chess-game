import GamesRepository from "../repositories/gamesRepository.js";
import PoolService from "../services/poolService.js";
import ServerGame from "../models/ServerGame.js";
import ChessService from "../services/ChessService.js";
import Move from "../../../shared/src/models/Move.js";
import { MoveResultDTO, MoveDTO } from "../../../shared/src/interfaces/DTO.js";
import Position from "../../../shared/src/models/Position.js";
import ChessMoveOutCome from "../models/ChessMoveOutcome.js";

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

    public matchUsers(): ServerGame | null {
        const poolSize = this.poolService.getPoolSize();
        if (poolSize < 2) return null;

        const user1 = this.poolService.shiftUser();
        const user2 = this.poolService.shiftUser();
        if (user1 && user2) {
            const chessboard = this.chessService.initilizeChessboard(user1, user2);
            const game = new ServerGame(user1, user2, chessboard);
            const result = this.gamesRepository.addGame(game);
            if (result) return game;
        }
        return null;
    }

    public getGameState(socketId: string): ServerGame | null {
        const game = this.gamesRepository.getGameState(socketId);
        if (game) return game;
        return null;
    }

    private validateTurn(socketId: string): boolean {
        const game = this.getGameState(socketId);
        if (!game) return false;
        return game.getWhoseTurn().getSocketId() === socketId;
    }

    private validateOwnership(socketId: string, chessPieceId: string): boolean {
        const game = this.getGameState(socketId);
        if (!game) return false;
        const chessboard = game.getChessboard();
        for (const row of chessboard) {
            for (const cell of row) {
                const chessPiece = cell.getChessPiece();
                if (chessPiece && chessPiece.getId() === chessPieceId) {
                    const owner = chessPiece.getUser();
                    return owner.getSocketId() === socketId;
                }
            }
        }
        return false;
    }

    public moveChessPiece(socketId: string, move: MoveDTO): MoveResultDTO | null {
        const game = this.getGameState(socketId);
        if (!game) return null

        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const reconstructedMove = new Move(move.chessPieceId, oldPosition, newPosition);
        const chessboard = game.getChessboard();

        const isTurnValid = this.validateTurn(socketId);
        const isOwnershipValid = this.validateOwnership(socketId, move.chessPieceId);
        const isNewPositionValid = this.chessService.isTargetPositionOccupiedBySamePlayer(socketId, newPosition, game.getChessboard());

        if (!isTurnValid || !isOwnershipValid || isNewPositionValid) return null;

        const moveOutcome: ChessMoveOutCome = this.chessService.moveChessPiece(reconstructedMove, chessboard);
        game.increaseScore(moveOutcome.getScoreIncrease());
        game.switchTurn();

        const moveResult: MoveResultDTO = {
            chessPieceId: move.chessPieceId,
            oldPostion: move.oldPosition,
            newPosition: move.newPosition,
            moveType: moveOutcome.getMoveType(),
            score: game.getClientScore(),
            whoseTurn: game.getWhoseTurn().getClientUser(),
            capturedPieceId: moveOutcome.getCapturedPieceId()
        };

        return moveResult;
    }
}