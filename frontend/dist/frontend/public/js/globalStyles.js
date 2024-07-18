const stylesheet = new CSSStyleSheet();
stylesheet.replace(`
h1, h2, h3, h4, h5, h6, p {
    margin: 0;
}

* {
    box-sizing: border-box;
}

button {
    border: 3px solid var(--b-color);
    border-radius: 0.5rem;
    font-size: 1rem;
    padding: 0.5rem;
    background-color: var(--a-color);
    color: var(--b-color);
    cursor: pointer;
    transition: all .5s ease;
}

button:hover {
    background-color: var(--b-color);
    color: var(--a-color);
}

    `).catch(console.error);
export default stylesheet;
