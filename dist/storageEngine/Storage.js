"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
/**
 * Storage to save, update, get and delete files from specific engine.
 * You can inject your preferred storage engine.
 */
let Storage = class Storage {
    /**
     * Inject implementation
     * @param {IStorageEngine} engine - Storage engine implementation
     */
    constructor(engine) {
        this.engine = engine;
    }
    /**
     * Set storage engine configurations
     * @param {object} options - Configuration options
     */
    setConfiguration(options) {
        this.engine.setConfiguration(options);
    }
    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     */
    saveFile(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.engine.saveFile(options);
        });
    }
    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file
     */
    getFile(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.engine.getFile(options);
        });
    }
    /**
     * Update file stored
     * @param {object} options - File identifier or location and additional parameters
     */
    updateFile(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.engine.updateFile(options);
        });
    }
    /**
     * Delete file from storage engine
     * @param {object} options - Identifier of the file to delete and additional parameters
     */
    deleteFile(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.engine.deleteFile(options);
        });
    }
};
Storage = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)('Engine')),
    tslib_1.__metadata("design:paramtypes", [Object])
], Storage);
exports.default = Storage;
//# sourceMappingURL=Storage.js.map