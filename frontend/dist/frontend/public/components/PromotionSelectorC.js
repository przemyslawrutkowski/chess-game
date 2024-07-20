import { MovementStrategy } from '../../../shared/src/enums/MovementStrategy.js';
import globalStyle from '../js/globalStyles.js';
const template = document.createElement('template');
template.innerHTML = `
    <style>
        .promotion-selector {
            display: none;
        }
    </style>
    <div class="promotion-selector">
        <div class="promotion-option" data-piece="rook">♜</div>
        <div class="promotion-option" data-piece="knight">♞</div>
        <div class="promotion-option" data-piece="bishop">♝</div>
        <div class="promotion-option" data-piece="queen">♛</div>
    </div>
`;
const pieceTypeToMovementStrategy = new Map([
    ['rook', MovementStrategy.RookMovement],
    ['knight', MovementStrategy.KnightMovement],
    ['bishop', MovementStrategy.BishopMovement],
    ['queen', MovementStrategy.QueenMovement],
]);
export default class PromotionSelector extends HTMLElement {
    promotionSelector;
    constructor() {
        super();
        const clone = template.content.cloneNode(true);
        this.promotionSelector = clone.querySelector('.promotion-selector');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }
    connectedCallback() {
        this.promotionSelector.querySelectorAll('.promotion-option').forEach(option => {
            option.addEventListener('click', this.handleSelection);
        });
    }
    handleSelection(event) {
        const target = event.target;
        const pieceType = target.getAttribute('data-piece');
        if (pieceType === null)
            throw new Error('Piece type not found');
        const movementStrategy = pieceTypeToMovementStrategy.get(pieceType);
        if (movementStrategy) {
            this.dispatchEvent(new CustomEvent('promotionSelected', {
                detail: { movementStrategy },
                bubbles: true,
                composed: true
            }));
        }
    }
    show() {
        this.promotionSelector.style.display = 'block';
    }
    hide() {
        this.promotionSelector.style.display = 'none';
    }
}
customElements.define('promotion-selector', PromotionSelector);
