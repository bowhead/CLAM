import 'reflect-metadata';
import ICacheEngine from './ICacheEngine';
/**
 * The NonceManager class is used to manage the nonce value
 * when the user uses web3 transactions
 */
declare class NonceManager {
    cacheEngine: ICacheEngine;
    /**
     * This constructor starts the instance with the cacheEngine
     * option and a nonce value passed as parameters.
     *
     * @param {string} cacheEngine cacheEngine option
     * @param {number} nonce nonce value
     */
    constructor(cacheEngine: string, nonce: number);
    /**
     * This function returns the current value of the nonce.
     *
     * @returns {number} nonce.
     */
    get(): number;
    /**
     * This function save a new nonce value.
     *
     * @param {number} nonce new value of nonce variable
     */
    save(nonce: number): void;
}
export default NonceManager;
