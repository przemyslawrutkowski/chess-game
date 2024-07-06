import globalStyle from '../js/globalStyles.js';
import ChessPieceC from './ChessPieceC.js';
import ChessboardCell from '../../src/models/ChessboardCell.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import Events from '../../../shared/src/events/Events.js';
import Position from '../../../shared/src/models/Position.js';
import Move from '../../../shared/src/models/Move.js';
import { MoveDTO } from '../../src/interfaces/DTO.js';

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
    private cell: HTMLDivElement;
    private chessboardCell: ChessboardCell;
    private socket: any;

    constructor(chessboardCell: ChessboardCell) {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.cell = clone.querySelector('.cell') as HTMLDivElement;

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

        this.addEventListener('requestPosition', (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail && customEvent.detail.callback) {
                const position = new Position(this.getXPosition(), this.getYPosition());
                customEvent.detail.callback(position);
            }
        });
    }

    private handleDragOver(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    }

    private handleDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer) {
            const moveDataJson = event.dataTransfer.getData('application/json');
            const moveData: MoveDTO = JSON.parse(moveDataJson);
            const oldPosition = moveData.position;
            const newPostition = new Position(this.getXPosition(), this.getYPosition());
            const move = new Move(moveData.chessPieceId, oldPosition, newPostition);
            this.socket.emit(Events.UPDATE_GAME_STATE, move);
        }
    }

    public setChessPiece(chessPiece: ChessPieceC) {
        this.cell.appendChild(chessPiece);
    }

    public unsetChessPiece() {
        this.cell.innerHTML = '';
    }

    public getChessPiece() {
        return this.cell.querySelector('chess-piece');
    }

    public getXPosition() {
        return this.chessboardCell.getXPosition();
    }

    public getYPosition() {
        return this.chessboardCell.getYPosition();
    }
}

customElements.define('chessboard-cell', ChessboardCellC);