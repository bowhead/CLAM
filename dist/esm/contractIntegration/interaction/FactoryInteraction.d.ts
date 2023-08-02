import 'reflect-metadata';
import { Interaction, IOption } from '../';
/**
 * This class is used to generate
 */
declare class FactoryInteraction {
    optionsConsentInteraction: IOption[];
    optionsAccessInteraction: IOption[];
    optionsIPFSManagementInteraction: IOption[];
    /**
     *
     */
    constructor();
    /**
     * This function sets a new implementation of ConsentInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionConsentInteraction(option: IOption): void;
    /**
     * This function sets a new implementation of AccessInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionAccessInteraction(option: IOption): void;
    /**
     * This function sets a new implementation of IPFSManagementInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionsIPFSManagementInteraction(option: IOption): void;
    /**
     * This function generate a new instance of Interaction class using the implementations
     * passed in the parameter.
     *
     * @param {string} consentType This parameter is the option of consentInteraction implementation.
     * @param {string} accessType This parameter is the option of accessInteraction Implementation.
     * @param {string} IPFSManagementType This parameter is the option of IPFSManagementInteraction Implementation.
     * @returns {Interaction} return a new instance of Interaction class.
     */
    generateInteraction(consentType: string, accessType: string, IPFSManagementType: string): Interaction;
}
export default FactoryInteraction;
