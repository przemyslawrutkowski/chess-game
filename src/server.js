import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import User from './models/ServerUser.js';
import Game from './models/ServerGame.js';
import ChessService from './services/ChessService.js';
import Events from './events/Events.js';
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
const rootPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = 5000;
const httpServer = createServer((req, res) => {
    let pathname = new URL(req.url || '', `http://${req.headers.host}`).pathname;
    let filePath;
    let contentType;
    if (pathname.startsWith('/js') || pathname.startsWith('/html') || pathname.startsWith('/css') || pathname.startsWith('/components')) {
        filePath = path.join(rootPath, 'public', pathname);
        switch (path.extname(filePath)) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.html':
                contentType = 'text/html';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            default:
                contentType = 'text/plain';
        }
    }
    else if (pathname.startsWith('/src/models') || pathname.startsWith('/src/enums') || pathname.startsWith('/src/events')) {
        filePath = path.join(rootPath, pathname);
        contentType = 'text/javascript';
    }
    else {
        filePath = path.join(rootPath, 'public/html', 'index.html');
        contentType = 'text/html';
    }
    fs.readFile(filePath, (err, data) => {
        if (err)
            throw err;
        else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data, 'utf-8');
        }
    });
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
