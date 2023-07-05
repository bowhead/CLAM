"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
/**
 * This class is used to interact with the block-chain by making use
 * of consent and access interaction instances.
 */
let Interaction = class Interaction {
    /**
     * This constructor initializes the intent by injecting a specific
     * implementation of consent, access and IPFS management.
     *
     * @param {IConsentInteraction} consentInteraction This parameter is the implementation of ConsentInteraction.
     * @param {IAccessInteraction} accessInteraction This parameter is the implementation of AccessInteraction.
     * @param {IIPFSManagementInteraction} IPFSManagementInteraction This parameter is the implementation of IPFSManagementInteraction.
     */
    constructor(consentInteraction, accessInteraction, IPFSManagementInteraction) {
        this.accessInteraction = accessInteraction;
        this.consentInteraction = consentInteraction;
        this.IPFSManagementInteraction = IPFSManagementInteraction;
    }
    /**
     * This function set a new URL provider of web 3
     *
     * @param {string} urlProvider This parameter is the url provider.
     */
    setUrlProvider(urlProvider) {
        this.urlProvider = urlProvider;
    }
    /**
     * This function establishes a new identity to
     * perform the operations with the web 3
     *
     * @param {IdentityManager} identity This parameter is the identity that will be used to interact with the web.
     */
    setIdentity(identity) {
        this.identity = identity;
    }
};
Interaction = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)('ConsentInteraction')),
    tslib_1.__param(1, (0, tsyringe_1.inject)('AccessInteraction')),
    tslib_1.__param(2, (0, tsyringe_1.inject)('IPFSManagementInteraction')),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
], Interaction);
exports.default = Interaction;
//# sourceMappingURL=Interaction.js.map