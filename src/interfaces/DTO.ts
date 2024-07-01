import { MovementStrategy } from "../enums/MovementStrategy.js";
import { PlayerColor } from "../enums/PlayerColor.js";

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
    user: UserDTO;
    movementStrategy: MovementStrategy;
}

export type ChessboardDTO = Array<Array<ChessPieceDTO | null>>;