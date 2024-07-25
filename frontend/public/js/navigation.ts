import startInit from "./initializeConnection.js";
import gameController from "./gameController.js";

interface Page {
    path: string;
    href: string;
    content: string;
}

class NavigationModule {
    private pages: Page[] = [];

    public loadPage(href: string, pushToHistory: boolean): void {
        const main = document.querySelector('main');
        const pageToLoad = this.pages.find(page => page.href === href);
        if (main && pageToLoad) {
            main.innerHTML = pageToLoad.content;
            if (pushToHistory) window.history.pushState(null, '', pageToLoad.href);

            if (pageToLoad.href === '/') {
                window.history.replaceState(null, '', '/');
                startInit();
            } else if (pageToLoad.href === '/game') {
                gameController();
            }
            window.scrollX = 0;
        }
    }

    private async fetchPage(path: string, href: string) {
        try {
            const response = await fetch(path);
            const content = await response.text();
            this.pages.push({ path, href, content });
        } catch (err) {
            console.error("Failed to fetch page:", err);
        }
    }

    public async init() {
        await Promise.all([
            this.fetchPage('/html/startSection.html', '/'),
            this.fetchPage('/html/gameSection.html', '/game')
        ]);

        window.addEventListener('popstate', () => {
            if (window.location.pathname !== '/') {
                this.loadPage('/', false);
            }
        });

        this.loadPage('/', false);
    }
};

const navigationModule = new NavigationModule();

document.addEventListener('DOMContentLoaded', () => navigationModule.init());

export default navigationModule;