import Events from '../../../shared/src/events/Events.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import { reconstructGame, reconstructMoveResult } from '../../src/utils/reconstructor.js';
import { GameState } from '../../../shared/src/enums/GameState.js';
export default function gameController() {
    try {
        const infoPanel = document.querySelector('info-panel');
        const chessboardPanel = document.querySelector('chessboard-panel');
        if (!infoPanel || !chessboardPanel)
            throw new Error('Page content was not generated correctly');
        const socket = SocketConnection.getInstance();
        socket.emit(Events.GET_GAME_STATE);
        socket.once(Events.GAME_STATE, (game) => {
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
            const reconstructedMoveResult = reconstructMoveResult(moveResult);
            const oldPosition = reconstructedMoveResult.getOldPosition();
            const newPosition = reconstructedMoveResult.getNewPosition();
            const score = reconstructedMoveResult.getScore();
            const currentOrWinningPlayer = reconstructedMoveResult.getCurrentOrWinningPlayer();
            const gameState = reconstructedMoveResult.getGameState();
            const newMovementStrategy = reconstructedMoveResult.getNewMovementStrategy();
            if (currentOrWinningPlayer) {
                infoPanel.setAnnouncement(gameState, currentOrWinningPlayer.getUsername());
            }
            else {
                infoPanel.setAnnouncement(gameState);
            }
            infoPanel.setScore(score.getLightScore(), score.getDarkScore());
            chessboardPanel.update(oldPosition, newPosition, newMovementStrategy);
            if (gameState === GameState.Checkmate || gameState === GameState.Stalemate) {
                socket.off(Events.GAME_STATE_UPDATE);
                socket.off(Events.OPPONENT_DISCONNECTED);
            }
        });
        socket.once(Events.OPPONENT_DISCONNECTED, () => {
            infoPanel.setAnnouncement(GameState.Disconnection);
            socket.off(Events.GAME_STATE_UPDATE);
        });
    }
    catch (err) {
        console.error(err);
    }
}
