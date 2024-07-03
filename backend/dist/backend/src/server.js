import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import User from './models/ServerUser.js';
import Game from './models/ServerGame.js';
import ChessService from './services/ChessService.js';
import Events from '../../shared/src/events/Events.js';
const chessService = new ChessService();
function matchUsers() {
    if (pool.length >= 2) {
        const user1 = pool.shift();
        const user2 = pool.shift();
        if (!user1 || !user2)
            return;
        const chessboard = chessService.initilizeChessboard(user1, user2);
        const game = new Game(user1, user2, chessboard);
        games.push(game);
        io.to(user1.getSocketId()).emit(Events.MATCH_FOUND);
        io.to(user2.getSocketId()).emit(Events.MATCH_FOUND);
    }
}
function removeFromPool(socketId) {
    const index = pool.findIndex(user => user.getSocketId() === socketId);
    if (index !== -1) {
        pool.splice(index, 1);
    }
    io.to(socketId).emit(Events.REMOVED_FROM_POOL);
}
function getGameState(socketId) {
    const game = games.find(game => game.getUser1().getSocketId() === socketId || game.getUser2().getSocketId() === socketId);
    if (game) {
        io.to(socketId).emit(Events.GAME_STATE, game.getClientGame());
    }
}
const rootPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const port = 5000;
const mimeTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css'
};
const pathMappings = new Map([
    ['/interfaces', path.join(rootPath, 'frontend/dist/frontend/src/interfaces')],
    ['/models', path.join(rootPath, 'frontend/dist/frontend/src/models')],
    ['/types', path.join(rootPath, 'frontend/dist/frontend/src/types')],
    ['/components', path.join(rootPath, 'frontend/dist/frontend/public/components')],
    ['/js', path.join(rootPath, 'frontend/dist/frontend/public/js')],
]);
const pathMappingsShared = new Map([
    ['/enums', path.join(rootPath, 'frontend/dist/shared/src/enums')],
    ['/events', path.join(rootPath, 'frontend/dist/shared/src/events')],
]);
const serveFile = (pathname, res) => {
    let filePath = '';
    let contentType = '';
    if (pathname === '/') {
        filePath = path.join(rootPath, 'frontend/public/html/index.html');
        contentType = mimeTypes['.html'];
    }
    else {
        const extension = path.extname(pathname);
        if (extension === '.html' || extension === '.css') {
            filePath = path.join(rootPath, 'frontend/public', pathname);
            contentType = mimeTypes[extension];
        }
        else {
            let mappings = pathname.startsWith('/shared') ? pathMappingsShared : pathMappings;
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
        }
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
};
const httpServer = createServer((req, res) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pathname = url.pathname;
    serveFile(pathname, res);
});
const pool = [];
const games = [];
const io = new Server(httpServer);
io.on("connection", (socket) => {
    socket.on(Events.MATCH, (arg) => {
        const user = new User(arg.username, socket.id);
        pool.push(user);
        matchUsers();
    });
    socket.on(Events.REMOVE_FROM_POOL, () => {
        removeFromPool(socket.id);
    });
    socket.on(Events.GET_GAME_STATE, () => {
        getGameState(socket.id);
    });
});
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
