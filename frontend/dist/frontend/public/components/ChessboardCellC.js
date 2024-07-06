import globalStyle from '../js/globalStyles.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import Events from '../../../shared/src/events/Events.js';
import Position from '../../../shared/src/models/Position.js';
import Move from '../../../shared/src/models/Move.js';
const template = document.createElement('template');
template.innerHTML = `
    <style>
        .chess-field-light {
            background-color: var(--chess-field-a-color);
        }

        .chess-field-dark {
            background-color: var(--chess-field-b-color);
        }

        .cell {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }

        chess-piece {
            position: relative;
            z-index: 2000;
            width: 100%;
            height: 100%;
        }
    </style>

    <div class="cell"></div>
`;
export default class ChessboardCellC extends HTMLElement {
    cell;
    chessboardCell;
    socket;
    constructor(chessboardCell) {
        super();
        const clone = template.content.cloneNode(true);
        this.cell = clone.querySelector('.cell');
        this.chessboardCell = chessboardCell;
        const xPosition = chessboardCell.getXPosition();
        const yPosition = chessboardCell.getYPosition();
        this.cell.classList.add((xPosition + yPosition) % 2 === 0 ? 'chess-field-light' : 'chess-field-dark');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
        this.socket = SocketConnection.getInstance();
        this.addEventListener('dragover', this.handleDragOver);
        this.addEventListener('drop', this.handleDrop);
        this.addEventListener('requestPosition', (event) => {
            const customEvent = event;
            if (customEvent.detail && customEvent.detail.callback) {
                const position = new Position(this.getXPosition(), this.getYPosition());
                customEvent.detail.callback(position);
            }
        });
    }
    handleDragOver(event) {
        event.preventDefault();
        if (event.dataTransfer)
            event.dataTransfer.dropEffect = 'move';
    }
    handleDrop(event) {
        event.preventDefault();
        if (event.dataTransfer) {
            const moveDataJson = event.dataTransfer.getData('application/json');
            const moveData = JSON.parse(moveDataJson);
            const oldPosition = moveData.position;
            const newPostition = new Position(this.getXPosition(), this.getYPosition());
            const move = new Move(moveData.chessPieceId, oldPosition, newPostition);
            this.socket.emit(Events.UPDATE_GAME_STATE, move);
        }
    }
    setChessPiece(chessPiece) {
        this.cell.appendChild(chessPiece);
    }
    unsetChessPiece() {
        this.cell.innerHTML = '';
    }
    getChessPiece() {
        return this.cell.querySelector('chess-piece');
    }
    getXPosition() {
        return this.chessboardCell.getXPosition();
    }
    getYPosition() {
        return this.chessboardCell.getYPosition();
    }
}
customElements.define('chessboard-cell', ChessboardCellC);
