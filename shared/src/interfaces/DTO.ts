import { MovementStrategy } from "../enums/MovementStrategy.js";
import { PlayerColor } from "../enums/PlayerColor.js";
import { GameState } from "../enums/GameState.js";

export interface GameDTO {
    user1: UserDTO;
    user2: UserDTO;
    chessboard: ChessboardDTO;
    whoseTurn: UserDTO;
    score: ScoreDTO;
    gameState: GameState;
}

export interface UserDTO {
    username: string;
    color: PlayerColor;
}

export interface ChessPieceDTO {
    id: string;
    user: UserDTO;
    movementStrategy: MovementStrategy;
}

export interface ChessboardCellDTO {
    xPosition: number;
    yPosition: number;
    chessPiece: ChessPieceDTO | null;
}

export interface MoveResultDTO {
    oldPostion: PositionDTO;
    newPosition: PositionDTO;
    score: ScoreDTO;
    currentOrWinningPlayer: UserDTO | null;
    gameState: GameState;
}

export interface MoveDTO {
    oldPosition: PositionDTO;
    newPosition: PositionDTO;
    newMovementStrategy: MovementStrategy | null;
}

export interface PositionDTO {
    x: number;
    y: number;
}

export interface ScoreDTO {
    lightScore: number;
    darkScore: number;
}

export type ChessboardDTO = Array<Array<ChessboardCellDTO>>;