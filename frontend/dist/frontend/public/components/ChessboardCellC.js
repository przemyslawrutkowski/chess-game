import globalStyle from '../js/globalStyles.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import Events from '../../../shared/src/events/Events.js';
import Position from '../../../shared/src/models/Position.js';
import { MoveType } from '../../../shared/src/enums/MoveType.js';
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
    chessPiece = null;
    xPosition;
    yPosition;
    socket;
    constructor(chessboardCell) {
        super();
        const clone = template.content.cloneNode(true);
        this.cell = clone.querySelector('.cell');
        this.xPosition = chessboardCell.getXPosition();
        this.yPosition = chessboardCell.getYPosition();
        this.cell.classList.add((this.xPosition + this.yPosition) % 2 === 0 ? 'chess-field-light' : 'chess-field-dark');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
        this.socket = SocketConnection.getInstance();
    }
    connectedCallback() {
        this.addEventListener('dragover', this.handleDragOver.bind(this));
        this.addEventListener('drop', this.handleDrop.bind(this));
        this.addEventListener('requestPosition', this.handleRequestPosition.bind(this));
    }
    disconnectedCallback() {
        this.removeEventListener('dragover', this.handleDragOver.bind(this));
        this.removeEventListener('drop', this.handleDrop.bind(this));
        this.removeEventListener('requestPosition', this.handleRequestPosition.bind(this));
    }
    handleRequestPosition(event) {
        const customEvent = event;
        if (customEvent.detail && customEvent.detail.callback) {
            const position = new Position(this.getXPosition(), this.getYPosition());
            customEvent.detail.callback(position);
        }
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
            const oldPosition = moveData;
            const newPostition = { x: this.getXPosition(), y: this.getYPosition() };
            const move = { oldPosition: oldPosition, newPosition: newPostition };
            this.socket.emit(Events.CLASSIFY_MOVE, move);
            this.socket.once(Events.MOVE_CLASSIFICATION_RESULT, (result) => {
                if (result === MoveType.Invalid)
                    return;
                if (result === MoveType.PawnPromotion) {
                    const customEvent = new CustomEvent('pawnPromotion', {
                        detail: {
                            callback: (movementStrategy) => {
                                const pawnPromotionDTO = { oldPosition: oldPosition, newPosition: newPostition, newMovementStrategy: movementStrategy };
                                this.socket.emit(Events.UPDATE_GAME_STATE, result, pawnPromotionDTO);
                            }
                        },
                        bubbles: true,
                        composed: true
                    });
                    this.dispatchEvent(customEvent);
                    return;
                }
                else {
                    this.socket.emit(Events.UPDATE_GAME_STATE, result, move);
                    return;
                }
            });
        }
    }
    setChessPiece(chessPiece) {
        this.chessPiece = chessPiece;
        this.cell.appendChild(chessPiece);
    }
    unsetChessPiece() {
        this.cell.innerHTML = '';
        this.chessPiece = null;
    }
    getChessPiece() {
        return this.chessPiece;
    }
    getXPosition() {
        return this.xPosition;
    }
    getYPosition() {
        return this.yPosition;
    }
}
customElements.define('chessboard-cell', ChessboardCellC);
