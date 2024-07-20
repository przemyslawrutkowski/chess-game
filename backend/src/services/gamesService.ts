import GamesRepository from "../repositories/gamesRepository.js";
import PoolService from "../services/poolService.js";
import ServerGame from "../models/ServerGame.js";
import ChessService from "../services/ChessService.js";
import Move from "../../../shared/src/models/Move.js";
import { MoveResultDTO, MoveDTO } from "../../../shared/src/interfaces/DTO.js";
import Position from "../../../shared/src/models/Position.js";
import { GameState } from "../../../shared/src/enums/GameState.js";

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
        if (!user1 || !user2) return false;

        const chessboard = this.chessService.initilizeChessboard(user1, user2);
        const game = new ServerGame(user1, user2, chessboard);
        return this.gamesRepository.addGame(game);
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
        if (!game) return false;
        return game.getCurrentOrWinningPlayer()?.getSocketId() === socketId;
    }

    public moveChessPiece(socketId: string, move: MoveDTO): MoveResultDTO | null {
        const game = this.getGameState(socketId);
        if (!game) return null;

        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const reconstructedMove = new Move(oldPosition, newPosition, null);
        const chessboard = game.getChessboard();

        const isTurnValid = this.validateTurn(socketId);
        const isMoveValid = this.chessService.isMoveValid(socketId, oldPosition, newPosition, chessboard);

        if (!isTurnValid || !isMoveValid) return null;

        const scoreIncrease = this.chessService.moveChessPiece(reconstructedMove, chessboard);
        game.increaseScore(scoreIncrease);

        const gameState: GameState = this.chessService.checkGameState(socketId, chessboard);
        game.updateCurrentPlayerOrWinner(gameState);

        const currentOrWinningPlayer = game.getCurrentOrWinningPlayer();

        if (gameState === GameState.Checkmate || gameState === GameState.Stalemate) {
            if (!this.removeGame(socketId)) throw new Error('We could not remove the game');
        }

        const moveResult: MoveResultDTO = {
            oldPostion: move.oldPosition,
            newPosition: move.newPosition,
            score: game.getClientScore(),
            currentOrWinningPlayer: currentOrWinningPlayer ? currentOrWinningPlayer.getClientUser() : null,
            gameState: gameState
        };

        return moveResult;
    }

    public checkForPawnPromotion(socketId: string, move: MoveDTO): boolean {
        const game = this.getGameState(socketId);
        if (!game) return false;

        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const chessboard = game.getChessboard();

        const isTurnValid = this.validateTurn(socketId);
        const isMoveValid = this.chessService.isMoveValid(socketId, oldPosition, newPosition, chessboard);

        if (!isTurnValid || !isMoveValid) return false;

        return this.chessService.checkForPawnPromotion(oldPosition, newPosition, chessboard);
    }
}