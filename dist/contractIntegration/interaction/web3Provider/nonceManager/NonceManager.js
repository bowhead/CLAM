"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const MemoryCacheEngine_1 = tslib_1.__importDefault(require("./MemoryCacheEngine"));
const LocalStorageCacheEngine_1 = tslib_1.__importDefault(require("./LocalStorageCacheEngine"));
tsyringe_1.container.register('memory', MemoryCacheEngine_1.default);
tsyringe_1.container.register('localStorage', LocalStorageCacheEngine_1.default);
/**
 * The NonceManager class is used to manage the nonce value
 * when the user uses web3 transactions
 */
class NonceManager {
    /**
     * This constructor starts the instance with the cacheEngine
     * option and a nonce value passed as parameters.
     *
     * @param {string} cacheEngine cacheEngine option
     * @param {number} nonce nonce value
     */
    constructor(cacheEngine, nonce) {
        this.cacheEngine = tsyringe_1.container.resolve(cacheEngine);
        this.cacheEngine.set('nonce', nonce);
    }
    /**
     * This function returns the current value of the nonce.
     *
     * @returns {number} nonce.
     */
    get() {
        return Number(this.cacheEngine.get('nonce'));
    }
    /**
     * This function save a new nonce value.
     *
     * @param {number} nonce new value of nonce variable
     */
    save(nonce) {
        this.cacheEngine.set('nonce', nonce);
    }
}
exports.default = NonceManager;
//# sourceMappingURL=NonceManager.js.map