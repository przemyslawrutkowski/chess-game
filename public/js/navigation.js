import startInit from "./initializeConnection.js";
import gameController from "./gameController.js";
const navigationModule = {
    pages: [],
    loadPage: function (href, pushToHistory) {
        const main = document.querySelector('main');
        const pageToLoad = this.pages.find(page => page.href === href);
        if (main && pageToLoad) {
            main.innerHTML = pageToLoad.content;
            if (pushToHistory)
                window.history.pushState({ path: pageToLoad.path }, '', pageToLoad.path);
            if (pageToLoad.href === '/') {
                const onSuccess = () => this.loadPage('/chessboard', false);
                startInit(onSuccess);
            }
            else if (pageToLoad.href === '/chessboard') {
                gameController();
            }
        }
    },
    fetchPage: function (path, href) {
        return fetch(path)
            .then(response => response.text())
            .then(content => this.pages.push({ path, href, content }));
    },
    init: function () {
        Promise.all([
            this.fetchPage('/html/start.html', '/'),
            this.fetchPage('/html/chessboard.html', '/chessboard')
        ]).then(() => {
            this.loadPage('/', false);
            window.addEventListener('popstate', () => this.loadPage('/', false));
        });
    }
};
document.addEventListener('DOMContentLoaded', () => navigationModule.init());
