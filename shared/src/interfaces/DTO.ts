import { MovementStrategy } from "../enums/MovementStrategy.js";
import { PlayerColor } from "../enums/PlayerColor.js";
import { MoveType } from "../enums/MoveType.js";

export interface GameDTO {
    user1: UserDTO;
    user2: UserDTO;
    chessboard: ChessboardDTO;
    whoseTurn: UserDTO;
    score: ScoreDTO;
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

export interface MoveInitiationDTO {
    chessPieceId: string;
    position: PositionDTO;
}

export interface MoveResultDTO {
    chessPieceId: string;
    oldPostion: PositionDTO;
    newPosition: PositionDTO;
    moveType: MoveType;
    score: ScoreDTO;
    whoseTurn: UserDTO;
    capturedPieceId?: string;
}

export interface PositionDTO {
    x: number;
    y: number;
}

export interface MoveDTO {
    chessPieceId: string;
    oldPosition: PositionDTO;
    newPosition: PositionDTO;
}

export interface ScoreDTO {
    lightScore: number;
    darkScore: number;
}

export type ChessboardDTO = Array<Array<ChessboardCellDTO>>;