import Events from '../../../shared/src/events/Events.js';
import ClientGame from '../../src/models/ClientGame.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import { GameDTO, UserDTO, ChessboardDTO } from '../../../shared/src/interfaces/DTO.js';
import ClientUser from '../../src/models/ClientUser.js';
import ChessPiece from '../../src/models/ChessPiece.js';
import ChessboardCell from '../../src/models/ChessboardCell.js';
import InfoPanelC from '../components/InfoPanelC.js';
import ChessboardPanelC from '../components/ChessboardPanelC.js';

function reconstructGame(game: GameDTO): ClientGame {
    const user1: UserDTO = game.user1;
    const user2: UserDTO = game.user2;
    const chessboard: ChessboardDTO = game.chessboard;
    const whoseTurn: UserDTO = game.whoseTurn;

    const reconstructedUser1 = new ClientUser(user1.username, user1.color);
    const reconstructedUser2 = new ClientUser(user2.username, user2.color);
    const reconstructedChessboard = chessboard.map(row =>
        row.map(cell => {
            const chessPiece = cell.chessPiece;
            if (chessPiece) {
                const owner = chessPiece.user;
                const reconstructedOwner = new ClientUser(owner.username, owner.color);
                const reconstructedChessPiece = new ChessPiece(chessPiece.id, reconstructedOwner, chessPiece.movementStrategy);
                return new ChessboardCell(cell.xPosition, cell.yPosition, reconstructedChessPiece);
            }
            return new ChessboardCell(cell.xPosition, cell.yPosition, null);
        })
    );
    const reconstructedWhoseTurn = new ClientUser(whoseTurn.username, whoseTurn.color);
    return new ClientGame(reconstructedUser1, reconstructedUser2, reconstructedChessboard, reconstructedWhoseTurn);
}

export default function gameController() {
    try {
        const infoPanel = document.querySelector('info-panel') as InfoPanelC;
        const chessboardPanel = document.querySelector('chessboard-panel') as ChessboardPanelC;

        if (!infoPanel || !chessboardPanel) throw new Error('Page content was not generated correctly');

        const socket = SocketConnection.getInstance();

        socket.emit(Events.GET_GAME_STATE);

        socket.on(Events.GAME_STATE, (game: GameDTO) => {
            const reconstructedGame = reconstructGame(game);

            const chessboard = reconstructedGame.getChessboard();
            const user1 = reconstructedGame.getUser1();
            const user2 = reconstructedGame.getUser2();
            const whoseUserTurn = reconstructedGame.getWhoseTurn();

            chessboardPanel.innerHTML = '';

            infoPanel.initialize(user1, user2);
            infoPanel.setWhoseTurn(whoseUserTurn.getUsername());

            chessboardPanel.initialize(chessboard);
        });

    } catch (err) {
        console.error(err);
    }
}