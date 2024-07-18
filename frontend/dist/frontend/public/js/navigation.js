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
                window.history.pushState(null, '', pageToLoad.href);
            if (pageToLoad.href === '/') {
                window.history.replaceState(null, '', '/');
                const onSuccess = () => this.loadPage('/game', true);
                startInit(onSuccess);
            }
            else if (pageToLoad.href === '/game') {
                gameController();
            }
        }
    },
    fetchPage: async function (path, href) {
        try {
            const response = await fetch(path);
            const content = await response.text();
            this.pages.push({ path, href, content });
        }
        catch (err) {
            console.error("Failed to fetch page:", err);
        }
    },
    init: async function () {
        await Promise.all([
            this.fetchPage('/html/startSection.html', '/'),
            this.fetchPage('/html/gameSection.html', '/game')
        ]);
        this.loadPage('/', false);
        window.addEventListener('popstate', () => {
            if (window.location.pathname !== '/') {
                this.loadPage('/', false);
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', () => navigationModule.init());
export default navigationModule;
