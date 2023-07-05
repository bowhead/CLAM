import 'reflect-metadata';
import { constructor } from 'tsyringe/dist/typings/types';
import IStorageEngine from './IStorageEngine';
/**
 * Storage engine to save, update, get and delete files based on the injected engine
 */
declare class StorageEngine {
    private storageEngine;
    /**
     * Create new container and inject storage engine
     * @param {constructor<unknown>} engine - Storage engine type
     */
    constructor(engine?: constructor<unknown>);
    /**
     * Get storage engine instance
     * @returns {IStorageEngine} return storage engine instance
     */
    getStorageEngine(): IStorageEngine;
}
export default StorageEngine;
