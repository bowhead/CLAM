import { IAccessInteraction } from '.';
import { IdentityManager } from '../../indentityManager';
import IAccessResource from './IAccessResource';
/**
 *
 * This class is the implementation of IAccessInteraction interface,
 * this class is used to communicate with Access smart contract.
 *
 */
declare class AccessInteraction implements IAccessInteraction {
    private provider;
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
    giveAccess(resource: string, consentId: string, accounts: string[], resourceName: string, identity: IdentityManager): Promise<boolean>;
    /**
     * This function check the access in the resource using the consent id and the user address.
     *
     * @param {string} resource This parameter is the resource to be checked.
     * @param {string} consentId This parameter is the id of the consent to be checked.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} Return if the user has access in this consent.
     */
    checkAccess(resource: string, consentId: string, identity: IdentityManager): Promise<boolean>;
    /**
     * This function check the resource and it's state.
     *
     * @param {string} consentId This parameter is the resource to be returned.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<IAccessResource>} Return addres and state of the user in this consent.
     */
    getResourceByConsent(consentId: string, identity: IdentityManager): Promise<IAccessResource>;
}
export default AccessInteraction;
