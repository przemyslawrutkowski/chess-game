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
        return game.getCurrentOrWinningPlayer()?.getSocketId() === socketId;
    }

    public moveChessPiece(socketId: string, move: MoveDTO): MoveResultDTO | null {
        const game = this.getGameState(socketId);
        if (!game) return null

        const oldPosition = new Position(move.oldPosition.x, move.oldPosition.y);
        const newPosition = new Position(move.newPosition.x, move.newPosition.y);
        const reconstructedMove = new Move(oldPosition, newPosition);
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
            if (!this.gamesRepository.removeGame(socketId)) throw new Error('We could not remove the game');
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
}