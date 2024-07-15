import ServerUser from "../models/ServerUser.js";

export default class PoolRepository {
    private static instance: PoolRepository;
    private pool: ServerUser[];

    private constructor() {
        this.pool = [];
    }

    public static getInstance(): PoolRepository {
        if (!PoolRepository.instance) {
            PoolRepository.instance = new PoolRepository();
        }
        return PoolRepository.instance;
    }

    public getUser(socketId: string): ServerUser | undefined {
        return this.pool.find(user => user.getSocketId() === socketId);
    }

    public addUser(user: ServerUser): boolean {
        const exists = this.pool.some(u => u.getSocketId() === user.getSocketId());
        if (!exists) {
            this.pool.push(user);
            return true;
        }
        return false;
    }

    public removeUser(socketId: string): boolean {
        const index = this.pool.findIndex(u => u.getSocketId() === socketId);
        if (index !== -1) {
            this.pool.splice(index, 1);
            return true;
        }
        return false;
    }

    public shiftUser(): ServerUser | undefined {
        return this.pool.shift();
    }

    public getPoolSize(): number {
        return this.pool.length;
    }
}