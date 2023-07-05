"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const __1 = require("../");
/**
 * This class is used to generate
 */
class FactoryInteraction {
    /**
     *
     */
    constructor() {
        this.optionsConsentInteraction = [{ name: 'clam', option: __1.ConsentInteraction }];
        this.optionsAccessInteraction = [{ name: 'clam', option: __1.AccessInteraction }];
        this.optionsIPFSManagementInteraction = [{ name: 'clam', option: __1.IPFSManagementInteraction }];
    }
    /**
     * This function sets a new implementation of ConsentInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionConsentInteraction(option) {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionConsentExist = this.optionsConsentInteraction.find(optionAux => optionAux.name === option.name);
        if (optionConsentExist) {
            throw new Error('This option already exists.');
        }
        this.optionsConsentInteraction.push(option);
    }
    /**
     * This function sets a new implementation of AccessInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionAccessInteraction(option) {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionAccessExist = this.optionsAccessInteraction.find(optionAux => optionAux.name === option.name);
        if (optionAccessExist) {
            throw new Error('This option already exists.');
        }
        this.optionsAccessInteraction.push(option);
    }
    /**
     * This function sets a new implementation of IPFSManagementInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionsIPFSManagementInteraction(option) {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionIPFSManagementExist = this.optionsIPFSManagementInteraction.find(optionAux => optionAux.name === option.name);
        if (optionIPFSManagementExist) {
            throw new Error('This option already exists.');
        }
        this.optionsIPFSManagementInteraction.push(option);
    }
    /**
     * This function generate a new instance of Interaction class using the implementations
     * passed in the parameter.
     *
     * @param {string} consentType This parameter is the option of consentInteraction implementation.
     * @param {string} accessType This parameter is the option of accessInteraction Implementation.
     * @param {string} IPFSManagementType This parameter is the option of IPFSManagementInteraction Implementation.
     * @returns {Interaction} return a new instance of Interaction class.
     */
    generateInteraction(consentType, accessType, IPFSManagementType) {
        if (consentType.trim() === '' && consentType.trim().length === 0) {
            throw new Error('The consent implementation name must have a minimum of one character');
        }
        if (accessType.trim() === '' && accessType.trim().length === 0) {
            throw new Error('The access implementation name must have a minimum of one character');
        }
        if (IPFSManagementType.trim() === '' && IPFSManagementType.trim().length === 0) {
            throw new Error('The IPFS management implementation name must have a minimum of one character');
        }
        const consent = this.optionsConsentInteraction.find(option => option.name.toLowerCase() === consentType.toLowerCase());
        const access = this.optionsAccessInteraction.find(option => option.name.toLowerCase() === accessType.toLowerCase());
        const IPFSManagement = this.optionsIPFSManagementInteraction.find(option => option.name.toLowerCase() === IPFSManagementType.toLowerCase());
        if (!consent) {
            throw new Error('The consentInteraction type doesn\'t exist');
        }
        if (!access) {
            throw new Error('The accessInteraction type doesn\'t exist');
        }
        if (!IPFSManagement) {
            throw new Error('The IPFSManagementInteraction type doesn\'t exist');
        }
        tsyringe_1.container.register('ConsentInteraction', consent.option);
        tsyringe_1.container.register('AccessInteraction', access.option);
        tsyringe_1.container.register('IPFSManagementInteraction', IPFSManagement.option);
        const interaction = tsyringe_1.container.resolve(__1.Interaction);
        return interaction;
    }
}
exports.default = FactoryInteraction;
//# sourceMappingURL=FactoryInteraction.js.map