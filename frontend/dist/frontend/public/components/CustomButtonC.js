import globalStyle from '../js/globalStyles.js';
const template = document.createElement('template');
template.innerHTML = `
    <button></button>
`;
export default class CustomButtonC extends HTMLElement {
    button;
    constructor() {
        super();
        const clone = template.content.cloneNode(true);
        this.button = clone.querySelector('button');
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(clone);
        shadowRoot.adoptedStyleSheets = [globalStyle];
    }
    setStatus(status) {
        this.button.innerText = status;
    }
}
customElements.define('custom-button', CustomButtonC);
