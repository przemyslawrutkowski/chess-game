import PoolRepository from "../repositories/poolRepository.js";
import ServerUser from "../models/ServerUser.js";


export default class PoolService {
    private static instance: PoolService;
    private poolRepository: PoolRepository;

    private constructor() {
        this.poolRepository = PoolRepository.getInstance();
    }

    public static getInstance(): PoolService {
        if (!PoolService.instance) {
            PoolService.instance = new PoolService();
        }
        return PoolService.instance;
    }

    public getUser(socketId: string) {
        return this.poolRepository.getUser(socketId);
    }

    public addUser(username: string, socketId: string): boolean {
        const user = new ServerUser(username, socketId);
        return this.poolRepository.addUser(user);
    }

    public removeUser(socketId: string): boolean {
        return this.poolRepository.removeUser(socketId);
    }

    public shiftUser(): ServerUser | undefined {
        return this.poolRepository.shiftUser();
    }

    public getPoolSize(): number {
        return this.poolRepository.getPoolSize();
    }
}