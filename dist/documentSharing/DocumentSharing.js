"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
/**
 * Document sharing, allow save encrypted files and sharing them with another users.
 */
let DocumentSharing = class DocumentSharing {
    /**
     * Document sharing constructor
     * Using to set storage engine instance
     * @param {IStorageEngine} instance - Storage engine instance
     */
    constructor(instance) {
        this.storageEngine = instance;
    }
    /**
     * Save file encrypted with AES on storage engine
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     */
    saveFile(identity, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = options;
            if (!body.file)
                throw new Error('File parameter is missing');
            const consentApproved = yield body.contractInteraction.consentInteraction.getConsentById(body.consentId, identity.address, identity);
            if (!consentApproved)
                throw new Error('Consent is not approved');
            const fileEncrypted = yield identity.encryptionLayer.encryptData(identity.privateKey, body.file || '');
            const data = {
                file: fileEncrypted,
                address: identity.address,
                fileName: body.fileName,
                keepOriginalName: body.keepOriginalName || false
            };
            const cid = yield this.storageEngine.saveFile(data);
            return cid;
        });
    }
    /**
     * Get file encrypted with AES
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file in base64
     */
    getFile(identity, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const info = options;
            if (!info.cid)
                throw new Error('File identifier is missing');
            const params = {
                cid: info.cid,
                address: identity.address
            };
            const file = yield this.storageEngine.getFile(params);
            const decodeFile = Buffer.from(file, 'base64').toString('utf8');
            const decryptedFile = identity.encryptionLayer.decryptData(identity.privateKey, decodeFile);
            return decryptedFile;
        });
    }
    /**
     * Update file encrypted with AES on storage engine
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File identifier or location and additional parameters
     */
    updateFile(identity, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = options;
            if (!body.file)
                throw new Error('File parameter is missing');
            const fileEncrypted = yield identity.encryptionLayer.encryptData(identity.privateKey, body.file);
            const data = {
                file: fileEncrypted,
                address: identity.address,
                cid: body.cid,
                privateKey: identity.privateKey
            };
            yield this.storageEngine.updateFile(data);
        });
    }
    /**
     * Save file shared on storage engine, it is encrypted with PGP
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File to save and additional parameters
     * @param {string} userIds - PGP public keys of users authorized to view the shared file
     * @returns {string} returns the file identifier or location
     */
    sharedFile(identity, options, userIds) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = options;
            if (!body.file)
                throw new Error('File parameter is missing');
            const consentApproved = yield body.contractInteraction.consentInteraction.getConsentById(body.consentId, identity.address, identity);
            if (!consentApproved)
                throw new Error('Consent is not approved');
            userIds += `,${identity.publicKeySpecial}`;
            const fileEncrypted = yield identity.encryptionLayer.encryptData(userIds, body.file);
            const data = {
                file: fileEncrypted,
                address: identity.address,
                fileName: body.fileName,
                keepOriginalName: body.keepOriginalName || false
            };
            const cid = yield this.storageEngine.saveFile(data);
            return cid;
        });
    }
    /**
     * Get file shared encrypted with PGP
     * @param {IdentityManager} identity - User identity that is allowed to get file
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file in base64
     */
    getSharedFile(identity, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const info = options;
            if (!info.cid)
                throw new Error('File identifier is missing');
            const access = yield info.contractInteraction.accessInteraction.checkAccess(info.cid, info.consentId, identity);
            if (!access)
                throw new Error('You do not have access to the resource');
            const params = {
                cid: info.cid,
                address: info.owner || ''
            };
            const file = yield this.storageEngine.getFile(params);
            const decodeFile = Buffer.from(file, 'base64').toString('utf8');
            const decryptedFile = yield identity.encryptionLayer.decryptData(identity.privateKeySpecial, decodeFile);
            return decryptedFile;
        });
    }
};
DocumentSharing = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], DocumentSharing);
exports.default = DocumentSharing;
//# sourceMappingURL=DocumentSharing.js.map