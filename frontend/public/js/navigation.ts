import startInit from "./initializeConnection.js";
import gameController from "./gameController.js";

interface Page {
    path: string;
    href: string;
    content: string;
}

interface NavigationModule {
    pages: Page[];
    loadPage: (href: string, pushToHistory: boolean) => void;
    fetchPage: (href: string, path: string) => Promise<void>;
    init: () => Promise<void>;
}

const navigationModule: NavigationModule = {
    pages: [],
    loadPage: function (href: string, pushToHistory: boolean) {
        const main = document.querySelector('main');
        const pageToLoad = this.pages.find(page => page.href === href);
        if (main && pageToLoad) {
            main.innerHTML = pageToLoad.content;
            if (pushToHistory) window.history.pushState(null, '', pageToLoad.href);

            if (pageToLoad.href === '/') {
                window.history.replaceState(null, '', '/');
                const onSuccess = () => this.loadPage('/game', true);
                startInit(onSuccess);
            } else if (pageToLoad.href === '/game') {
                gameController();
            }
        }
    },
    fetchPage: async function (path: string, href: string) {
        try {
            const response = await fetch(path);
            const content = await response.text();
            this.pages.push({ path, href, content });
        } catch (err) {
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