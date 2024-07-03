import Events from '../../../shared/src/events/Events.js';
import ClientGame from '../../src/models/ClientGame.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import ClientUser from '../../src/models/ClientUser.js';
import ChessPiece from '../../src/models/ChessPiece.js';
import ChessboardCell from '../../src/models/ChessboardCell.js';
function reconstructGame(game) {
    const user1 = game.user1;
    const user2 = game.user2;
    const chessboard = game.chessboard;
    const whoseTurn = game.whoseTurn;
    const reconstructedUser1 = new ClientUser(user1.username, user1.color);
    const reconstructedUser2 = new ClientUser(user2.username, user2.color);
    const reconstructedChessboard = chessboard.map(row => row.map(cell => {
        const chessPiece = cell.chessPiece;
        if (chessPiece) {
            const owner = chessPiece.user;
            const reconstructedOwner = new ClientUser(owner.username, owner.color);
            const reconstructedChessPiece = new ChessPiece(reconstructedOwner, chessPiece.movementStrategy);
            return new ChessboardCell(cell.xPosition, cell.yPosition, reconstructedChessPiece);
        }
        return new ChessboardCell(cell.xPosition, cell.yPosition, null);
    }));
    const reconstructedWhoseTurn = new ClientUser(whoseTurn.username, whoseTurn.color);
    return new ClientGame(reconstructedUser1, reconstructedUser2, reconstructedChessboard, reconstructedWhoseTurn);
}
export default function gameController() {
    try {
        const infoPanel = document.querySelector('info-panel');
        const chessboardPanel = document.querySelector('chessboard-panel');
        if (!infoPanel || !chessboardPanel)
            throw new Error('Page content was not generated correctly');
        const socket = SocketConnection.getInstance();
        let infoPanelInitialized = false;
        let chessboardInitialized = false;
        socket.emit(Events.GET_GAME_STATE);
        socket.on(Events.GAME_STATE, (game) => {
            const reconstructedGame = reconstructGame(game);
            const chessboard = reconstructedGame.getChessboard();
            const whoseUserTurn = reconstructedGame.getWhoseTurn();
            chessboardPanel.innerHTML = '';
            if (!infoPanelInitialized) {
                const user1 = reconstructedGame.getUser1();
                const user2 = reconstructedGame.getUser2();
                infoPanel.initialize(user1, user2);
                infoPanelInitialized = true;
            }
            infoPanel.setWhoseTurn(whoseUserTurn.getUsername());
            if (!chessboardInitialized) {
                chessboardPanel.initialize(chessboard);
                chessboardInitialized = true;
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}
