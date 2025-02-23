import globalStyle from '../js/globalStyles.js';

const template = document.createElement('template');
template.innerHTML = `
    <style>
        div {
            display: none;
            border: 3px dotted var(--b-color);
            height: 2.5rem;
            width: 2.5rem;
            border-radius: 50%;
            animation: spin 3s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
    </style>

    <div></div>
`;

export default class LoadingSpinnerC extends HTMLElement {
    private div: HTMLElement;

    constructor() {
        super();
        const clone = template.content.cloneNode(true) as DocumentFragment;
        this.div = clone.querySelector('div') as HTMLElement;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }

    public show() {
        this.div.style.display = 'block';
    }

    public hide() {
        this.div.style.display = 'none';
    }
}

customElements.define('loading-spinner', LoadingSpinnerC);