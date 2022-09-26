import 'reflect-metadata';
import ICacheEngine from './ICacheEngine';
import { container } from 'tsyringe';
import MemoryCacheEngine from './MemoryCacheEngine';
import LocalStorageCacheEngine from './LocalStorageCacheEngine';
container.register('memory', MemoryCacheEngine);
container.register('localStorage', LocalStorageCacheEngine);

/**
 * The NonceManager class is used to manage the nonce value 
 * when the user uses web3 transactions
 */
class NonceManager {
    public cacheEngine: ICacheEngine;

    /**
     * This constructor starts the instance with the cacheEngine 
     * option and a nonce value passed as parameters.
     * 
     * @param {string} cacheEngine cacheEngine option 
     * @param {number} nonce nonce value
     */
    public constructor(cacheEngine: string, nonce: number) {
        this.cacheEngine = container.resolve(cacheEngine);
        this.cacheEngine.set('nonce', nonce);
    }

    /**
     * This function returns the current value of the nonce.
     * 
     * @returns {number} nonce.
     */
    public get(): number {
        return Number(this.cacheEngine.get('nonce'));
    }

    /**
     * This function save a new nonce value.
     * 
     * @param {number} nonce new value of nonce variable 
     */
    public save(nonce: number) {
        this.cacheEngine.set('nonce', nonce);
    }

}

export default NonceManager;