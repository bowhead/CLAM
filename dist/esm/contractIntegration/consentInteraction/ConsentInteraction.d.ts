import { IConsentInteraction } from '.';
import { IdentityManager } from '../../indentityManager';
import IConsentKeys from './IConsentKeys';
/**
 * This class represent the implementation of IConsentInteraction interface,
 * this class is used to interact with the consent smart contract.
 */
declare class ConsentInteraction implements IConsentInteraction {
    private provider;
    /**
     * This function saves a consent with the information passed as parameters.
     *
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} return the address of the transaction.
     */
    saveConsent(consentId: string, identity: IdentityManager): Promise<boolean>;
    /**
     * This function cancel a consent based in the consentID passed in the parameter.
     *
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} return the address of the transaction.
     */
    cancelConsent(consentId: string, identity: IdentityManager): Promise<boolean>;
    /**
     * This function return the consent status based in the consentID passed in the parameter.
     *
     * @param {string} consentId This parameters is the consentID to indentify the consent.
     * @param {string} owner This parameter is the owner addres.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} return the consent status.
     */
    getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<boolean>;
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
    addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<boolean>;
    /**
     * This funtion return the addres's and keys's the consent based in the consentId.
     *
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<IConsentKeys>} return the addres's and keys's
     */
    getKeys(consentId: string, identity: IdentityManager): Promise<IConsentKeys>;
}
export default ConsentInteraction;
