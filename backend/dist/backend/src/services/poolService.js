import PoolRepository from "../repositories/poolRepository.js";
import ServerUser from "../models/ServerUser.js";
export default class PoolService {
    static instance;
    poolRepository;
    constructor() {
        this.poolRepository = PoolRepository.getInstance();
    }
    static getInstance() {
        if (!PoolService.instance) {
            PoolService.instance = new PoolService();
        }
        return PoolService.instance;
    }
    getUser(socketId) {
        return this.poolRepository.getUser(socketId);
    }
    addUser(username, socketId) {
        const user = new ServerUser(username, socketId);
        return this.poolRepository.addUser(user);
    }
    removeUser(socketId) {
        return this.poolRepository.removeUser(socketId);
    }
    shiftUser() {
        return this.poolRepository.shiftUser();
    }
    getPoolSize() {
        return this.poolRepository.getPoolSize();
    }
}
