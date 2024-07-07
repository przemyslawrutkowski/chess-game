export default class PoolRepository {
    static instance;
    pool;
    constructor() {
        this.pool = [];
    }
    static getInstance() {
        if (!PoolRepository.instance) {
            PoolRepository.instance = new PoolRepository();
        }
        return PoolRepository.instance;
    }
    getUser(socketId) {
        return this.pool.find(user => user.getSocketId() === socketId);
    }
    addUser(user) {
        const exists = this.pool.some(u => u.getSocketId() === user.getSocketId());
        if (!exists) {
            this.pool.push(user);
            return true;
        }
        return false;
    }
    removeUser(socketId) {
        const initialLength = this.pool.length;
        this.pool = this.pool.filter(u => u.getSocketId() !== socketId);
        return this.pool.length < initialLength;
    }
    shiftUser() {
        return this.pool.shift();
    }
    getPoolSize() {
        return this.pool.length;
    }
}
