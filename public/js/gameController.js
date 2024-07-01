import Events from '../../src/events/Events.js';
import ClientGame from '../../src/models/ClientGame.js';
import createChessPieceSVG from '../../src/utils/DOMElementsCreator.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import ClientUser from '../../src/models/ClientUser.js';
import ChessPiece from '../../src/models/ChessPiece.js';
import { PlayerColor } from '../../src/enums/PlayerColor.js';
function reconstructGame(game) {
    const user1 = game.user1;
    const user2 = game.user2;
    const chessboard = game.chessboard;
    const whoseTurn = game.whoseTurn;
    const reconstructedUser1 = new ClientUser(user1.username, user1.color);
    const reconstructedUser2 = new ClientUser(user2.username, user2.color);
    const reconstructedChessboard = chessboard.map(row => row.map(piece => {
        if (piece) {
            const pieceOwner = piece.user;
            const reconstructedPieceOwner = new ClientUser(pieceOwner.username, pieceOwner.color);
            return new ChessPiece(reconstructedPieceOwner, piece.movementStrategy);
        }
        return null;
    }));
    const reconstructedWhoseTurn = new ClientUser(whoseTurn.username, whoseTurn.color);
    return new ClientGame(reconstructedUser1, reconstructedUser2, reconstructedChessboard, reconstructedWhoseTurn);
}
export default function gameController() {
    try {
        const opponents = document.querySelectorAll('.opponents-info .opponent');
        const whoseTurn = document.querySelector('.whose-turn');
        const chessboardContainer = document.querySelector('.chessboard');
        if (!whoseTurn || !chessboardContainer)
            throw new Error('Page content was not generated correctly');
        const socket = SocketConnection.getInstance();
        let infoPanelSet = false;
        socket.emit(Events.GET_GAME_STATE); //ONLY AT THE BEGINNING, ONCE!
        socket.on(Events.GAME_STATE, (game) => {
            const reconstructedGame = reconstructGame(game);
            console.log(reconstructedGame);
            const user1 = reconstructedGame.getUser1();
            const user2 = reconstructedGame.getUser2();
            const chessboard = reconstructedGame.getChessboard();
            const whoseUserTurn = reconstructedGame.getWhoseTurn();
            chessboardContainer.innerHTML = '';
            if (opponents.length === 2 && !infoPanelSet) {
                const opponent1 = opponents.item(0);
                const opponent2 = opponents.item(1);
                const opponent1Avatar = opponent1.querySelector('.avatar path');
                const opponent2Avatar = opponent2.querySelector('.avatar path');
                const opponent1Username = opponent1.querySelector('.username');
                const opponent2Username = opponent2.querySelector('.username');
                if (user1.getColor() === PlayerColor.Light) {
                    opponent1Avatar.classList.add('chess-piece-light');
                    opponent2Avatar.classList.add('chess-piece-dark');
                }
                else {
                    opponent2Avatar.classList.add('chess-piece-light');
                    opponent1Avatar.classList.add('chess-piece-dark');
                }
                opponent1Username.innerText = user1.getUsername();
                opponent2Username.innerText = user2.getUsername();
                infoPanelSet = true;
            }
            whoseTurn.innerText = `It's ${whoseUserTurn.getUsername()} turn...`;
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const cell = document.createElement('div');
                    cell.setAttribute('x-pos', row.toString());
                    cell.setAttribute('y-pos', col.toString());
                    cell.classList.add('cell');
                    cell.classList.add((row + col) % 2 === 0 ? 'chess-field-light' : 'chess-field-dark');
                    const chessPiece = chessboard[row][col];
                    if (chessPiece) {
                        const chessPieceUser = chessPiece.getUser();
                        const chessPieceMovementStrategy = chessPiece.getMovementStrategy();
                        const chessPieceColor = chessPieceUser.getColor();
                        let svg;
                        if (chessPieceColor !== undefined) {
                            svg = createChessPieceSVG(chessPieceColor, chessPieceMovementStrategy);
                            cell.appendChild(svg);
                        }
                    }
                    chessboardContainer.appendChild(cell);
                }
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}
