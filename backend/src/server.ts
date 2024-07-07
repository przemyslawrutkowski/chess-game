import { createServer, ServerResponse } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Events from '../../shared/src/events/Events.js';
import Move from '../../shared/src/models/Move.js';

import PoolService from './services/poolService.js';
import GamesService from './services/gamesService.js';
import ChessService from './services/ChessService.js';

const poolService = PoolService.getInstance();
const gamesService = GamesService.getInstance();
const chessService = ChessService.getInstance();

const rootPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

const port = 5000;

const mimeTypes: { [key: string]: string } = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
}

const pathMappings = new Map<string, string>([
    ['/interfaces', path.join(rootPath, 'frontend/dist/frontend/src/interfaces')],
    ['/models', path.join(rootPath, 'frontend/dist/frontend/src/models')],
    ['/types', path.join(rootPath, 'frontend/dist/frontend/src/types')],

    ['/components', path.join(rootPath, 'frontend/dist/frontend/public/components')],
    ['/js', path.join(rootPath, 'frontend/dist/frontend/public/js')],
]);

const pathMappingsShared = new Map<string, string>([
    ['/enums', path.join(rootPath, 'frontend/dist/shared/src/enums')],
    ['/events', path.join(rootPath, 'frontend/dist/shared/src/events')],
    ['/models', path.join(rootPath, 'frontend/dist/shared/src/models')],
    ['/interfaces', path.join(rootPath, 'frontend/dist/shared/src/interfaces')]
]);


const serveFile = (pathname: string, res: ServerResponse) => {
    let filePath: string = '';
    let contentType: string = '';

    if (pathname === '/') {
        filePath = path.join(rootPath, 'frontend/public/html/index.html');
        contentType = mimeTypes['.html'];
    } else {
        const extension = path.extname(pathname);
        if (extension === '.html' || extension === '.css') {
            filePath = path.join(rootPath, 'frontend/public', pathname);
            contentType = mimeTypes[extension];
        } else {
            let mappings: Map<string, string> = pathname.startsWith('/shared') ? pathMappingsShared : pathMappings;

            let pathFound = false;
            for (let [key, value] of mappings) {
                if (pathname.includes(key)) {
                    const lastSegment = pathname.split('/').pop();
                    filePath = path.join(value, lastSegment || '');
                    contentType = mimeTypes['.js'];
                    pathFound = true;
                    break;
                }
            }
            if (!pathFound) {
                res.writeHead(404);
                res.end(`Path not found: ${pathname}`);
                return;
            }
        }
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end(`File not found: ${filePath}`);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
}

const httpServer = createServer((req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;
    serveFile(pathname, res);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {

    socket.on(Events.MATCH, (username: string) => {
        const addResult = poolService.addUser(username, socket.id);
        if (addResult) {
            const matchResult = gamesService.matchUsers();
            if (matchResult) {
                io.to(matchResult.getUser1().getSocketId()).emit(Events.MATCH_FOUND);
                io.to(matchResult.getUser2().getSocketId()).emit(Events.MATCH_FOUND);
            }
        }
    });

    socket.on(Events.REMOVE_FROM_POOL, () => {
        const result = poolService.removeUser(socket.id);
        if (result) {
            io.to(socket.id).emit(Events.REMOVED_FROM_POOL);
        }
    })

    socket.on(Events.GET_GAME_STATE, () => {
        const result = gamesService.getGameState(socket.id);
        if (result) {
            io.to(socket.id).emit(Events.GAME_STATE, result.getClientGame());
        }
    });

    socket.on(Events.UPDATE_GAME_STATE, (move: Move) => {
        console.log(move);
    });
});

httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});