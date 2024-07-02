const stylesheet = new CSSStyleSheet();
stylesheet.replace(
    `
h1, h2, h3, h4, h5, h6, p {
    margin: 0;
}

* {
    box-sizing: border-box;
}
    `).catch(console.error);

export default stylesheet;