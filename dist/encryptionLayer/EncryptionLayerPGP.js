"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const openpgp_1 = require("openpgp");
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
/**
 * This class is the implementation of EncryptionLayer using the PGP algorithm.
 */
let EncryptionLayerPGP = class EncryptionLayerPGP {
    constructor() {
        /**
         * This function encrypts the data passed as a parameter using the
         * public key passed as a parameter.
         *
         * @param {string} publicKeyPGP This parameter is the public key to encrypt the data.
         * @param {string} data This parameter is the data that will be encrypted.
         * @returns {string} returns a string promise, when resolved it returns a string representing the encrypted data.
         */
        this.encryptData = (publicKeyPGP, data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (data.trim().length == 0)
                throw new Error('The data must have at least one character');
            const pubKeys = publicKeyPGP.split(',');
            const publicKeys = pubKeys.map((key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                return (yield (0, openpgp_1.readKey)({ armoredKey: key }));
            }));
            const encrypted = yield (0, openpgp_1.encrypt)({
                message: yield (0, openpgp_1.createMessage)({ text: data }),
                encryptionKeys: yield Promise.all(publicKeys),
            });
            return encrypted.toString();
        });
        /**
         * This function decrypt the data passed as a parameter using the
         * private key passed as a parameter.
         *
         * @param {string} privateKeyPGP This parameter is the private key to decrypt the data.
         * @param {string} dataEncrypted This parameter is the encrypted data that will be decrypted.
         * @returns {string} return a string promise, when resolve it returns a string representing the decrypted data.
         */
        this.decryptData = (privateKeyPGP, dataEncrypted) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (dataEncrypted.trim().length == 0)
                throw new Error('The data must have at least one character');
            const privateKeysArr = privateKeyPGP.split(',');
            const privateKeys = privateKeysArr.map((key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield (0, openpgp_1.decryptKey)({
                    privateKey: yield (0, openpgp_1.readPrivateKey)({ armoredKey: key }),
                    passphrase: 'passphrase'
                });
            }));
            const message = yield (0, openpgp_1.readMessage)({
                armoredMessage: dataEncrypted
            });
            const { data: decrypted } = yield (0, openpgp_1.decrypt)({
                message,
                decryptionKeys: yield Promise.all(privateKeys)
            });
            return decrypted.toString();
        });
    }
};
EncryptionLayerPGP = tslib_1.__decorate([
    (0, tsyringe_1.injectable)()
], EncryptionLayerPGP);
exports.default = EncryptionLayerPGP;
//# sourceMappingURL=EncryptionLayerPGP.js.map