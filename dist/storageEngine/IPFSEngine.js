"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const ethereumjs_util_1 = require("ethereumjs-util");
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const buffer_1 = require("buffer");
/**
 * Storage engine to save, update, get and delete files from IPFS.
 * You can inject your preferred storage engine.
 */
class IPFSEngine {
    /**
     * Set IPFS connection settings
     * @param {object} options - Connection options
     */
    setConfiguration(options) {
        const config = options;
        this.instance = axios_1.default.create({
            baseURL: config.URL,
            timeout: config.timeout,
            headers: {
                'x-api-key': config.ApiKey
            }
        });
    }
    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     * @throws {BadRequestError} File was not save on IPFS
     * @throws {InternalServerError} Internal server error
     */
    saveFile(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = options;
            const formData = new form_data_1.default();
            formData.append('file', body.file);
            formData.append('address', body.address);
            formData.append('fileName', body.fileName);
            formData.append('keepOriginalName', String(body.keepOriginalName));
            const res = yield this.instance.post('/file', formData);
            return res.data.CID;
        });
    }
    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file
     * @throws {NotFoundError} File not found in IPFS
     * @throws {InternalServerError} Internal server error
     */
    getFile(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const params = options;
            const file = yield this.instance.get(`/file?address=${params.address}&cid=${params.cid}`);
            return file.data.file;
        });
    }
    /**
     * Update file stored
     * @param {object} options - File identifier or location and additional parameters
     * @throws {NotFoundError} File not found in IPFS or not registered in smart contract
     * @throws {ForbiddenError} User is not the owner of the file
     * @throws {InternalServerError} Internal server error
     */
    updateFile(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const body = options;
            const formData = new form_data_1.default();
            const serverHash = yield this.getChallenge(body.address);
            const signature = this.generateSignature(serverHash, body.privateKey);
            formData.append('file', body.file);
            formData.append('address', body.address);
            formData.append('cid', body.cid || '');
            formData.append('sigV', signature.sigV.toString());
            formData.append('sigR', signature.sigR);
            formData.append('sigS', signature.sigS);
            formData.append('hash', serverHash);
            yield this.instance.put('/file', formData);
        });
    }
    /**
     * Delete file from storage engine
     * @param {object} options - Identifier of the file to delete and additional parameters
     * @throws {NotFoundError} File not found in IPFS or not registered in smart contract
     * @throws {ForbiddenError} User is not the owner of the file
     * @throws {InternalServerError} Internal server error
     */
    deleteFile(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const params = options;
            const serverHash = yield this.getChallenge(params.address);
            const signature = this.generateSignature(serverHash, params.privateKey);
            const body = {
                address: params.address,
                cid: params.cid,
                hash: serverHash,
                sigV: signature.sigV,
                sigR: signature.sigR,
                sigS: signature.sigS
            };
            yield this.instance.delete('/file', { data: body });
        });
    }
    /**
     * Get hash by user address
     * @param {string} address - User address
     * @returns {Promise<string>} returns hash made by user address
     */
    getChallenge(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const res = yield this.instance.get(`/challenge?address=${address}`);
            return res.data.hash;
        });
    }
    /**
     * Generate signature from hash
     * @param {string} serverHash - Hash
     * @param {string} privateKey - Private key
     * @returns {IIpfsSignature} Signature
     */
    generateSignature(serverHash, privateKey) {
        const hash = buffer_1.Buffer.from(serverHash, 'hex');
        const privateKeyBuffer = buffer_1.Buffer.from(privateKey, 'hex');
        const { v, r, s } = (0, ethereumjs_util_1.ecsign)(hash, privateKeyBuffer);
        const signData = {
            hash: serverHash,
            sigR: r.toString('hex'),
            sigS: s.toString('hex'),
            sigV: v
        };
        return signData;
    }
}
exports.default = IPFSEngine;
//# sourceMappingURL=IPFSEngine.js.map