import Events from '../../../shared/src/events/Events.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import { reconstructGame, reconstructMoveResult } from '../../src/utils/reconstructor.js';
export default function gameController() {
    try {
        const infoPanel = document.querySelector('info-panel');
        const chessboardPanel = document.querySelector('chessboard-panel');
        if (!infoPanel || !chessboardPanel)
            throw new Error('Page content was not generated correctly');
        const socket = SocketConnection.getInstance();
        socket.emit(Events.GET_GAME_STATE);
        socket.on(Events.GAME_STATE, (game) => {
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
        socket.on(Events.GAME_STATE_UPDATE, (moveResult) => {
            const reconstructedMoveResult = reconstructMoveResult(moveResult);
            //console.log(reconstructedMoveResult);
            //const chessPieceId = reconstructedMoveResult.getChessPieceId();
            const oldPosition = reconstructedMoveResult.getOldPosition();
            const newPosition = reconstructedMoveResult.getNewPosition();
            //const moveType = reconstructedMoveResult.getMoveType();
            const score = reconstructedMoveResult.getScore(); //used
            const whoseTurn = reconstructedMoveResult.getWhoseTurn(); //used
            //const capturedPieceId = reconstructedMoveResult.getCapturedPieceId();
            infoPanel.setWhoseTurn(whoseTurn.getUsername());
            infoPanel.setScore(score.getLightScore(), score.getDarkScore());
            chessboardPanel.update(oldPosition, newPosition);
        });
    }
    catch (err) {
        console.error(err);
    }
}
