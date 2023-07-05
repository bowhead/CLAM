"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//eslint-disable-next-line
const tsyringe_1 = require("tsyringe");
const web3_1 = tslib_1.__importDefault(require("web3"));
const FactoryWeb3Interaction_1 = tslib_1.__importDefault(require("../interaction/web3Provider/FactoryWeb3Interaction"));
/**
 * Implementation of IIPFSManagementInteraction interface
 * Interact with the IPFS management contract
 */
let IPFSManagementInteraction = class IPFSManagementInteraction {
    constructor() {
        this.provider = FactoryWeb3Interaction_1.default.getInstance().generateWeb3Provider('web3');
    }
    /**
     * Add file to IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {string} fileName - File name
     * @param {IdentityManager} identity - Identity of the file owner
     * @returns {void}
     */
    addFile(fileHash, fileName, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fileHash.trim() === '' || fileHash.trim().length === 0)
                throw new Error('fileHash must have at least 1 character');
            if (fileName.trim() === '' || fileName.trim().length === 0)
                throw new Error('fileName must have at least 1 character');
            const contract = this.provider.getMethods('IPFS');
            const options = {
                action: 'send',
                methodName: 'addFile'
            };
            yield this.provider.useContractMethod(contract, identity, options, fileHash, web3_1.default.utils.fromAscii(fileName));
            return;
        });
    }
    /**
     * Remove file from IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - Identity of the file owner
     * @returns {void}
     */
    removeFile(fileHash, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fileHash.trim() === '' || fileHash.trim().length === 0)
                throw new Error('fileHash must have at least 1 character');
            const contract = this.provider.getMethods('IPFS');
            const options = {
                action: 'send',
                methodName: 'removeFile'
            };
            yield this.provider.useContractMethod(contract, identity, options, fileHash);
            return;
        });
    }
    /**
     * Check if the user can access to the file
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if has access, false if not
     */
    checkAccess(fileHash, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fileHash.trim() === '' || fileHash.trim().length === 0)
                throw new Error('fileHash must have at least 1 character');
            const contract = this.provider.getMethods('IPFS');
            const options = {
                action: 'call',
                methodName: 'checkAccess'
            };
            const result = yield this.provider.useContractMethod(contract, identity, options, identity.address, fileHash);
            return result;
        });
    }
    /**
     * Check if the file is available
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if is available, false if not
     */
    fileIsAvailable(fileHash, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (fileHash.trim() === '' || fileHash.trim().length === 0)
                throw new Error('fileHash must have at least 1 character');
            const contract = this.provider.getMethods('IPFS');
            const options = {
                action: 'call',
                methodName: 'fileIsAvailable'
            };
            const result = yield this.provider.useContractMethod(contract, identity, options, identity.address, fileHash);
            return result;
        });
    }
    /**
     * Get list of user files
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<IIpfsManagementFiles>} returns file list
     */
    getFiles(identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const contract = this.provider.getMethods('IPFS');
            const options = {
                action: 'call',
                methodName: 'getFiles'
            };
            const result = yield this.provider.useContractMethod(contract, identity, options, identity.address);
            return result;
        });
    }
};
IPFSManagementInteraction = tslib_1.__decorate([
    (0, tsyringe_1.injectable)()
], IPFSManagementInteraction);
exports.default = IPFSManagementInteraction;
//# sourceMappingURL=IPFSManagementInteraction.js.map