import { MovementStrategy } from '../../../shared/src/enums/MovementStrategy.js';
import globalStyle from '../js/globalStyles.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        .promotion-selector {
            margin: 0 auto;
            display: none;
            flex-direction: row;
            width: 300px;
            height: 60px;
            gap: 1rem;
        }

        .promotion-option {
            flex: 1;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3rem;
        }

        .promotion-option:hover {
            transform: scale(1.1);
        }
    </style>

    <div class="promotion-selector">
        <div class="promotion-option" data-piece="rook">♜</div>
        <div class="promotion-option" data-piece="knight">♞</div>
        <div class="promotion-option" data-piece="bishop">♝</div>
        <div class="promotion-option" data-piece="queen">♛</div>
    </div>
`;

const pieceTypeToMovementStrategy = new Map<string, MovementStrategy>([
    ['rook', MovementStrategy.RookMovement],
    ['knight', MovementStrategy.KnightMovement],
    ['bishop', MovementStrategy.BishopMovement],
    ['queen', MovementStrategy.QueenMovement],
]);

export default class PromotionSelector extends HTMLElement {
    private promotionSelector: HTMLDivElement;

    constructor() {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.promotionSelector = clone.querySelector('.promotion-selector') as HTMLDivElement
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }

    connectedCallback() {
        this.promotionSelector.querySelectorAll('.promotion-option').forEach(option => {
            option.addEventListener('click', this.handleSelection);
        });
    }

    private handleSelection(event: Event) {
        const target = event.target as HTMLDivElement;
        const pieceType = target.getAttribute('data-piece');
        if (pieceType === null) throw new Error('Piece type not found');

        const movementStrategy = pieceTypeToMovementStrategy.get(pieceType);

        if (movementStrategy) {
            this.dispatchEvent(new CustomEvent('promotionSelected', {
                detail: { movementStrategy },
                bubbles: true,
                composed: true
            }));
        }
    }

    public show() {
        this.promotionSelector.style.display = 'flex';
    }

    public hide() {
        this.promotionSelector.style.display = 'none';
    }
}

customElements.define('promotion-selector', PromotionSelector);