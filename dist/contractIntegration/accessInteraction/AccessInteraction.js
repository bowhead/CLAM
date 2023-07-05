"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*eslint no-unused-vars: "error"*/
/*global Promise*/
//eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const tsyringe_1 = require("tsyringe");
const web3_1 = tslib_1.__importDefault(require("web3"));
const FactoryWeb3Interaction_1 = tslib_1.__importDefault(require("../interaction/web3Provider/FactoryWeb3Interaction"));
/**
 *
 * This class is the implementation of IAccessInteraction interface,
 * this class is used to communicate with Access smart contract.
 *
 */
let AccessInteraction = class AccessInteraction {
    constructor() {
        this.provider = FactoryWeb3Interaction_1.default.getInstance().generateWeb3Provider('web3');
    }
    /**
     * This function gives access by making use of the values passed as parameters.
     *
     * @param {string} resource This parameter is the resource to be shared.
     * @param {string} consentId This parameter is the id of the consent.
     * @param {string} accounts This parameter is the accounts to give access.
     * @param {string} resourceName This parameter is the resource name.
     * @param {string} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} Return the trasaction address.
     */
    giveAccess(resource, consentId, accounts, resourceName, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (resource.trim() === '' || resource.trim().length === 0)
                throw new Error('The resource must have at least one character');
            if (consentId.trim() === '' || consentId.trim().length === 0)
                throw new Error('The consentID must have at least one character');
            if (accounts.length === 0)
                throw new Error('Accounts must have at least one element');
            const contract = this.provider.getMethods('access');
            const options = {
                action: 'send',
                methodName: 'giveAccess'
            };
            const result = yield this.provider.useContractMethod(contract, identity, options, resource, web3_1.default.utils.fromAscii(consentId), accounts, web3_1.default.utils.fromAscii(resourceName));
            return result.status;
        });
    }
    /**
     * This function check the access in the resource using the consent id and the user address.
     *
     * @param {string} resource This parameter is the resource to be checked.
     * @param {string} consentId This parameter is the id of the consent to be checked.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} Return if the user has access in this consent.
     */
    checkAccess(resource, consentId, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (resource.trim() === '' || resource.trim().length === 0)
                throw new Error('The resource must have at least one character');
            if (consentId.trim() === '' || consentId.trim().length === 0)
                throw new Error('The consentID must have at least one character');
            const contract = this.provider.getMethods('access');
            const options = {
                action: 'call',
                methodName: 'checkAccess'
            };
            return yield this.provider.useContractMethod(contract, identity, options, resource, web3_1.default.utils.fromAscii(consentId));
        });
    }
    /**
     * This function check the resource and it's state.
     *
     * @param {string} consentId This parameter is the resource to be returned.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<IAccessResource>} Return addres and state of the user in this consent.
     */
    getResourceByConsent(consentId, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (consentId.trim() === '' || consentId.trim().length === 0)
                throw new Error('The consentID must have at least one character');
            const contract = this.provider.getMethods('access');
            const options = {
                action: 'call',
                methodName: 'getResourceByConsent'
            };
            return this.provider.useContractMethod(contract, identity, options, web3_1.default.utils.fromAscii(consentId));
        });
    }
};
AccessInteraction = tslib_1.__decorate([
    (0, tsyringe_1.injectable)()
], AccessInteraction);
exports.default = AccessInteraction;
//# sourceMappingURL=AccessInteraction.js.map