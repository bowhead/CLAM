"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
const openpgp_1 = require("openpgp");
/**
 * This class
 */
let KeysGeneratorPGP = class KeysGeneratorPGP {
    constructor() {
        /**
         * This function generate keys using an specific implementation.
         *
         * @param {any} data This parameter is the information to generate the keys.
         * @returns {Primise<IKeys>} return the keys.
         */
        this.generateKeys = (data) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const PGPKeys = {
                privateKey: '',
                publicKey: ''
            };
            const { name, email } = data;
            const { privateKey, publicKey } = yield (0, openpgp_1.generateKey)({
                type: 'ecc',
                curve: 'curve25519',
                userIDs: [{ name, email }],
                passphrase: 'passphrase',
                format: 'armored'
            });
            PGPKeys.privateKey = privateKey;
            PGPKeys.publicKey = publicKey;
            return PGPKeys;
        });
    }
};
KeysGeneratorPGP = tslib_1.__decorate([
    (0, tsyringe_1.injectable)()
], KeysGeneratorPGP);
exports.default = KeysGeneratorPGP;
//# sourceMappingURL=KeysGeneratorPGP.js.map