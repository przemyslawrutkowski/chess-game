import globalStyle from '../js/globalStyles.js';
import ChessPieceC from './ChessPieceC.js';
import ChessboardCell from '../../src/models/ChessboardCell.js';
import SocketConnection from '../../src/models/SocketConnection.js';
import Events from '../../../shared/src/events/Events.js';
import Position from '../../../shared/src/models/Position.js';
import { MoveDTO, PositionDTO } from '../../../shared/src/interfaces/DTO.js';
import { MovementStrategy } from '../../../shared/src/enums/MovementStrategy.js';

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
    private chessPiece: ChessPieceC | null = null;
    private xPosition: number;
    private yPosition: number;
    private socket: any;

    constructor(chessboardCell: ChessboardCell) {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.cell = clone.querySelector('.cell') as HTMLDivElement;

        this.xPosition = chessboardCell.getXPosition();
        this.yPosition = chessboardCell.getYPosition();
        this.cell.classList.add((this.xPosition + this.yPosition) % 2 === 0 ? 'chess-field-light' : 'chess-field-dark');

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];

        this.socket = SocketConnection.getInstance();
    }

    connectedCallback() {
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
            const moveData: PositionDTO = JSON.parse(moveDataJson);
            const oldPosition = moveData;
            const newPostition: PositionDTO = { x: this.getXPosition(), y: this.getYPosition() };
            const move: MoveDTO = { oldPosition: oldPosition, newPosition: newPostition, newMovementStrategy: null };
            this.socket.emit(Events.IS_MOVE_VALID, move);
            this.socket.once(Events.MOVE_VALIDATION_RESULT, (valid: boolean) => {
                if (!valid) return;

                this.socket.emit(Events.CHECK_PAWN_PROMOTION, move);

                this.socket.once(Events.PAWN_PROMOTION_RESULT, (promotion: boolean) => {
                    if (promotion) {
                        const customEvent = new CustomEvent('pawnPromotion', {
                            detail: {
                                callback: (movementStrategy: MovementStrategy) => {
                                    move.newMovementStrategy = movementStrategy;
                                    this.socket.emit(Events.UPDATE_GAME_STATE, move);
                                }
                            },
                            bubbles: true,
                            composed: true
                        });
                        this.dispatchEvent(customEvent);
                    } else {
                        this.socket.emit(Events.UPDATE_GAME_STATE, move);
                    }
                });
            });
        }
    }

    public setChessPiece(chessPiece: ChessPieceC) {
        this.chessPiece = chessPiece;
        this.cell.appendChild(chessPiece);
    }

    public unsetChessPiece() {
        this.cell.innerHTML = '';
        this.chessPiece = null;
    }

    public getChessPiece() {
        return this.chessPiece;
    }

    public getXPosition() {
        return this.xPosition;
    }

    public getYPosition() {
        return this.yPosition;
    }
}

customElements.define('chessboard-cell', ChessboardCellC);