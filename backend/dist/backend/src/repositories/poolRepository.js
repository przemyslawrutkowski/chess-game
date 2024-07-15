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
        const index = this.pool.findIndex(u => u.getSocketId() === socketId);
        if (index !== -1) {
            this.pool.splice(index, 1);
            return true;
        }
        return false;
    }
    shiftUser() {
        return this.pool.shift();
    }
    getPoolSize() {
        return this.pool.length;
    }
}
