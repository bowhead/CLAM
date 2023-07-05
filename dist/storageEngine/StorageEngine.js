"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const IPFSEngine_1 = tslib_1.__importDefault(require("./IPFSEngine"));
const Storage_1 = tslib_1.__importDefault(require("./Storage"));
/**
 * Storage engine to save, update, get and delete files based on the injected engine
 */
class StorageEngine {
    /**
     * Create new container and inject storage engine
     * @param {constructor<unknown>} engine - Storage engine type
     */
    constructor(engine) {
        const childContainer = tsyringe_1.container.createChildContainer();
        if (engine) {
            childContainer.register('Engine', { useClass: engine });
        }
        else {
            childContainer.register('Engine', { useClass: IPFSEngine_1.default });
        }
        this.storageEngine = childContainer.resolve(Storage_1.default);
    }
    /**
     * Get storage engine instance
     * @returns {IStorageEngine} return storage engine instance
     */
    getStorageEngine() {
        return this.storageEngine;
    }
}
exports.default = StorageEngine;
//# sourceMappingURL=StorageEngine.js.map