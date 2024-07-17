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
        socket.once(Events.GAME_STATE, (game) => {
            console.log(`game_state`);
            const reconstructedGame = reconstructGame(game);
            const chessboard = reconstructedGame.getChessboard();
            const user1 = reconstructedGame.getUser1();
            const user2 = reconstructedGame.getUser2();
            const whoseUserTurn = reconstructedGame.getWhoseTurn();
            const gameState = reconstructedGame.getGameState();
            chessboardPanel.innerHTML = '';
            infoPanel.initialize(user1, user2);
            infoPanel.setAnnouncement(gameState, whoseUserTurn.getUsername());
            chessboardPanel.initialize(chessboard);
        });
        socket.on(Events.GAME_STATE_UPDATE, (moveResult) => {
            console.log(`game_state_update`);
            const reconstructedMoveResult = reconstructMoveResult(moveResult);
            const oldPosition = reconstructedMoveResult.getOldPosition();
            const newPosition = reconstructedMoveResult.getNewPosition();
            const score = reconstructedMoveResult.getScore();
            const currentOrWinningPlayer = reconstructedMoveResult.getCurrentOrWinningPlayer();
            const gameState = reconstructedMoveResult.getGameState();
            if (currentOrWinningPlayer) {
                infoPanel.setAnnouncement(gameState, currentOrWinningPlayer.getUsername());
            }
            else {
                infoPanel.setAnnouncement(gameState);
            }
            infoPanel.setScore(score.getLightScore(), score.getDarkScore());
            chessboardPanel.update(oldPosition, newPosition);
        });
        socket.on(Events.OPPONENT_DISCONNECTED, () => console.log('Opponent disconnected'));
    }
    catch (err) {
        console.error(err);
    }
}
