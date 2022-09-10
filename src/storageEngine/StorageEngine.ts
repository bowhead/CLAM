import 'reflect-metadata';
import { container } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';
import IPFSEngine from './IPFSEngine';
import IStorageEngine from './IStorageEngine';
import Storage from './Storage';

/**
 * Storage engine to save, update, get and delete files based on the injected engine
 */
class StorageEngine {
    private storageEngine: IStorageEngine;

    /**
     * Create new container and inject storage engine
     * @param {constructor<unknown>} engine - Storage engine type
     */
    constructor(engine?: constructor<unknown>) {
        const childContainer = container.createChildContainer();

        if(engine) {
            childContainer.register('Engine', { useClass: engine });
        } else {
            childContainer.register('Engine', { useClass:  IPFSEngine });
        }

        this.storageEngine = childContainer.resolve(Storage);
    }

    /**
     * Get storage engine instance
     * @returns {IStorageEngine} return storage engine instance
     */
    getStorageEngine (): IStorageEngine {
        return this.storageEngine;
    }
}

export default StorageEngine;