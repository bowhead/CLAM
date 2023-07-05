"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// eslint-disable-next-line @typescript-eslint/no-var-requires
/*eslint no-unused-vars: "error"*/
//eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
//eslint-disable-next-line @typescript-eslint/no-var-requires
require('@babel/core').transformSync('code', {
    plugins: ['@babel/plugin-proposal-decorators'],
});
//eslint-disable-next-line  no-unused-vars,@typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
const web3_1 = tslib_1.__importDefault(require("web3"));
const FactoryWeb3Interaction_1 = tslib_1.__importDefault(require("../interaction/web3Provider/FactoryWeb3Interaction"));
/**
 * This class represent the implementation of IConsentInteraction interface,
 * this class is used to interact with the consent smart contract.
 */
let ConsentInteraction = class ConsentInteraction {
    constructor() {
        this.provider = FactoryWeb3Interaction_1.default.getInstance().generateWeb3Provider('web3');
    }
    /**
     * This function saves a consent with the information passed as parameters.
     *
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} return the address of the transaction.
     */
    saveConsent(consentId, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (consentId.trim() === '' || consentId.trim().length === 0)
                throw new Error('contentID must have at least 1 character');
            const contract = this.provider.getMethods('consent');
            const options = {
                action: 'send',
                methodName: 'updateConsent'
            };
            const result = yield this.provider.useContractMethod(contract, identity, options, web3_1.default.utils.fromAscii(consentId), true);
            return result.status;
        });
    }
    /**
     * This function cancel a consent based in the consentID passed in the parameter.
     *
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} return the address of the transaction.
     */
    cancelConsent(consentId, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (consentId.trim() === '' || consentId.trim().length === 0)
                throw new Error('contentID must have at least 1 character');
            const contract = this.provider.getMethods('consent');
            const options = {
                action: 'send',
                methodName: 'updateConsent'
            };
            const result = yield this.provider.useContractMethod(contract, identity, options, web3_1.default.utils.fromAscii(consentId), false);
            return result.status;
        });
    }
    /**
     * This function return the consent status based in the consentID passed in the parameter.
     *
     * @param {string} consentId This parameters is the consentID to indentify the consent.
     * @param {string} owner This parameter is the owner addres.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} return the consent status.
     */
    getConsentById(consentId, owner, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (consentId.trim() === '' || consentId.trim().length === 0)
                throw new Error('contentID must have at least 1 character');
            if (owner.trim() === '' || owner.trim().length === 0)
                throw new Error('Owner must have at least 1 character');
            if (!owner.trim().includes('0x'))
                throw new Error('Invalid owner, the string with has a correct format.');
            const contract = this.provider.getMethods('consent');
            const options = {
                action: 'call',
                methodName: 'getConsent'
            };
            return yield this.provider.useContractMethod(contract, identity, options, web3_1.default.utils.fromAscii(consentId), owner);
        });
    }
    /**
     * This funtion add a key in a consent based in the consentID in the case if the consent
     * has already been acepted.
     *
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {string} addressConsent This parameter is the adressConsent to indentify the consent.
     * @param {string} key  This parameter is the key to be added in the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>}  return the address of the transaction.
     */
    addKey(consentId, addressConsent, key, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (consentId.trim() === '' || consentId.trim().length === 0)
                throw new Error('contentID must have at least 1 character');
            if (addressConsent.trim() === '' || addressConsent.trim().length === 0)
                throw new Error('AddressConsent must have at least 1 character');
            if (!addressConsent.trim().includes('0x'))
                throw new Error('Invalid addressConsent, the string with has a correct format.');
            if (key.trim().length === 0 || key.trim() === '')
                throw new Error('Key must have at least 1 character');
            const contract = this.provider.getMethods('consent');
            const options = {
                action: 'send',
                methodName: 'addPGPKey'
            };
            const result = yield this.provider.useContractMethod(contract, identity, options, web3_1.default.utils.fromAscii(consentId), addressConsent, key);
            return result.status;
        });
    }
    /**
     * This funtion return the addres's and keys's the consent based in the consentId.
     *
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<IConsentKeys>} return the addres's and keys's
     */
    getKeys(consentId, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (consentId.trim() === '' || consentId.trim().length === 0)
                throw new Error('contentID must have at least 1 character');
            const contract = this.provider.getMethods('consent');
            const options = {
                action: 'call',
                methodName: 'getPGPKeys'
            };
            return yield this.provider.useContractMethod(contract, identity, options, web3_1.default.utils.fromAscii(consentId));
        });
    }
};
ConsentInteraction = tslib_1.__decorate([
    (0, tsyringe_1.injectable)()
], ConsentInteraction);
exports.default = ConsentInteraction;
//# sourceMappingURL=ConsentInteraction.js.map