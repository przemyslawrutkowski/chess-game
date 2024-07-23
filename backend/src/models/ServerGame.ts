import ServerUser from "./ServerUser.js";
import { GameDTO, ChessboardDTO, ChessPieceDTO, ScoreDTO } from "../../../shared/src/interfaces/DTO.js";
import { Chessboard } from "../types/Chessboard.js";
import Score from "../../../shared/src/models/Score.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";
import { GameState } from "../../../shared/src/enums/GameState.js";
import { MoveStatus } from "../enums/MoveStatus.js";

export default class ServerGame {
    private user1: ServerUser;
    private user2: ServerUser;
    private chessboard: Chessboard;
    private currentOrWinningPlayer: ServerUser | null;
    private score: Score;
    private gameState: GameState;
    private moveStatus: MoveStatus;

    constructor(user1: ServerUser, user2: ServerUser, chessboard: Chessboard) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.currentOrWinningPlayer = user1;
        this.score = new Score(0, 0);
        this.gameState = GameState.InProgress;
        this.moveStatus = MoveStatus.Completed;
    }

    public getUser1(): ServerUser {
        return this.user1;
    }

    public getUser2(): ServerUser {
        return this.user2;
    }

    public getChessboard(): Chessboard {
        return this.chessboard;
    }

    public getCurrentOrWinningPlayer(): ServerUser | null {
        return this.currentOrWinningPlayer;
    }

    public getClientGame(): GameDTO {
        const clientUser1 = this.user1.getClientUser();
        const clientUser2 = this.user2.getClientUser();
        const clientChessboard: ChessboardDTO = this.chessboard.map(row =>
            row.map(cell => {
                const chessPiece = cell.getChessPiece();
                let chessPieceDTO: ChessPieceDTO | null = null;
                if (chessPiece) {
                    const owner = chessPiece.getUser();
                    chessPieceDTO = {
                        id: chessPiece.getId(),
                        user: owner.getClientUser(),
                        movementStrategy: chessPiece.getMovementStrategy()
                    };
                }
                return {
                    xPosition: cell.getXPosition(),
                    yPosition: cell.getYPosition(),
                    chessPiece: chessPieceDTO
                };
            })
        );
        const currentOrWinningPlayer = this.currentOrWinningPlayer!.getClientUser();
        const score = this.getClientScore();
        return {
            user1: clientUser1,
            user2: clientUser2,
            chessboard: clientChessboard,
            whoseTurn: currentOrWinningPlayer,
            score: score,
            gameState: this.gameState
        };
    }

    public updateCurrentPlayerOrWinner(gameState: GameState): void {
        switch (gameState) {
            case GameState.Stalemate:
                this.gameState = gameState;
                this.currentOrWinningPlayer = null;
                break;
            case GameState.Checkmate:
                this.gameState = gameState;
                break;
            case GameState.InProgress:
                this.currentOrWinningPlayer = this.currentOrWinningPlayer === this.user1 ? this.user2 : this.user1;
                break;

        }
    }

    public getClientScore(): ScoreDTO {
        return { lightScore: this.score.getLightScore(), darkScore: this.score.getDarkScore() };
    }

    public increaseScore(score: number): void {
        if (this.currentOrWinningPlayer) {
            this.currentOrWinningPlayer.getColor() === PlayerColor.Light ? this.score.increaseLightScore(score) : this.score.increaseDarkScore(score);
        }
    }

    public setMoveStatus(moveStatus: MoveStatus): void {
        this.moveStatus = moveStatus;
    }

    public getMoveStatus(): MoveStatus {
        return this.moveStatus
    }
}