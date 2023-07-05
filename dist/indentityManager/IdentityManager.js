"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//eslint-disable-next-line @typescript-eslint/no-var-requires,spellcheck/spell-checker
const Mnemonic = require('bitcore-mnemonic');
// eslint-disable-next-line @typescript-eslint/no-var-requires,spellcheck/spell-checker
const { fromMnemonic } = require('ethereum-hdwallet');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
/**
 * This class is to create your mnemonic, address, public key and private key to build your identity,
 * it also provides you with the functionality to create your PGP keys using the implementation of
 * the IEncryptionLayer interface to generate your PGP keys, with these keys you will be able to
 * encrypt and decrypt information.
 */
let IdentityManager = class IdentityManager {
    /**
     * This constructor initializes the class instance with the values passed as parameters.
     *
     * @param  {IEncryptionLayer} encryptionLayer this parameter is the EncryptionLayer implementation.
     * @param {IKeysGenerator} keysGenerator this is parameter is the KeysGenerator implementation.
     */
    constructor(encryptionLayer, keysGenerator) {
        /**
         * This function generates an identity based on the mnemonic passed as parameters, in case of not passing
         * the mnemonic a new identity will be created based on a totally new mnemonic.
         *
         * @param {string} mnemonic This parameter is the 12 words that will be used to generate the identity information.
         */
        this.generateIdentity = (mnemonic = '') => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.mnemonic.trim() === '' && this.address.trim() === '' &&
                this.privateKey.trim() === '' && this.publicKey.trim() == '') {
                this.mnemonic = mnemonic.trim() === '' ? new Mnemonic(Mnemonic.Words.ENHLISH).toString() : mnemonic;
                const hdwallet = fromMnemonic(this.mnemonic);
                this.address = `0x${hdwallet.derive('m/44\'/60\'/0\'/0/0').getAddress().toString('hex')}`;
                this.privateKey = hdwallet.derive('m/44\'/60\'/0\'/0/0').getPrivateKey(true).toString('hex');
                this.publicKey = hdwallet.derive('m/44\'/60\'/0\'/0/0').getPublicKey(true).toString('hex');
            }
            const data = {
                name: this.address,
                email: `${this.address}@localhost.com`
            };
            if (!this.keysGenerator)
                throw new Error('Please set a specific implementation of keysGenerator');
            const { privateKey, publicKey } = yield this.keysGenerator.generateKeys(data);
            this.privateKeySpecial = privateKey;
            this.publicKeySpecial = publicKey;
        });
        this.mnemonic = '';
        this.address = '';
        this.privateKey = '';
        this.publicKey = '';
        this.privateKeySpecial = '';
        this.publicKeySpecial = '';
        this.encryptionLayer = encryptionLayer;
        this.keysGenerator = keysGenerator;
    }
};
IdentityManager = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)('EncryptionLayer')),
    tslib_1.__param(1, (0, tsyringe_1.inject)('KeysGenerator')),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], IdentityManager);
exports.default = IdentityManager;
//# sourceMappingURL=IdentityManager.js.map