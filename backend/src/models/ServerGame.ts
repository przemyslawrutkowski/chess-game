import ServerUser from "./ServerUser.js";
import { GameDTO, ChessboardDTO, ChessPieceDTO, ScoreDTO } from "../../../shared/src/interfaces/DTO.js";
import { Chessboard } from "../types/Chessboard.js";
import Score from "../../../shared/src/models/Score.js";
import { PlayerColor } from "../../../shared/src/enums/PlayerColor.js";

export default class ServerGame {
    private user1: ServerUser;
    private user2: ServerUser;
    private chessboard: Chessboard;
    private whoseTurn: ServerUser;
    private score: Score;
    private clientGame: GameDTO;

    constructor(user1: ServerUser, user2: ServerUser, chessboard: Chessboard) {
        this.user1 = user1;
        this.user2 = user2;
        this.chessboard = chessboard;
        this.whoseTurn = user1;
        this.score = new Score(0, 0);
        this.clientGame = this.setClientGame();
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

    public getWhoseTurn(): ServerUser {
        return this.whoseTurn;
    }

    public getClientGame(): GameDTO {
        return this.clientGame;
    }

    private setClientGame(): GameDTO {
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
        const whoseTurn = this.whoseTurn.getClientUser();
        const score = this.getClientScore();
        return {
            user1: clientUser1,
            user2: clientUser2,
            chessboard: clientChessboard,
            whoseTurn: whoseTurn,
            score: score
        };
    }

    public switchTurn(): void {
        this.whoseTurn = this.whoseTurn === this.user1 ? this.user2 : this.user1;
        this.clientGame = this.setClientGame();
    }

    public getClientScore(): ScoreDTO {
        return { lightScore: this.score.getLightScore(), darkScore: this.score.getDarkScore() };
    }

    public increaseScore(score: number): void {
        this.whoseTurn.getColor() === PlayerColor.Light ? this.score.increaseLightScore(score) : this.score.increaseDarkScore(score);
        this.clientGame = this.setClientGame();
    }
}