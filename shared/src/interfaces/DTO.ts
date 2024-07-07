import { MovementStrategy } from "../enums/MovementStrategy.js";
import { PlayerColor } from "../enums/PlayerColor.js";
import Position from "../models/Position.js";
import { MoveType } from "../enums/MoveType.js";

export interface GameDTO {
    user1: UserDTO;
    user2: UserDTO;
    chessboard: ChessboardDTO;
    whoseTurn: UserDTO;
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
    oldPostion: Position;
    newPosition: [number, number];
    moveType: MoveType;
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

export type ChessboardDTO = Array<Array<ChessboardCellDTO>>;