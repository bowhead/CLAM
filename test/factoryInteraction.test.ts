/*global expect, test, describe*/

import { IdentityManager } from '../src';
import { FactoryInteraction, IAccessInteraction, IConsentInteraction } from '../src/contractIntegration';



/**
 * Class
 */
class ConsentInteractionOther implements IConsentInteraction {
    /**
     * This function saves a consent with the information passed as parameters. 
     * 
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<any>} return the address of the transaction.
     */
    async saveConsent(consentId: string, identity: IdentityManager): Promise<any> {
        return consentId + identity;
    }
    /**
     * This function cancel a consent based in the consentID passed in th eparameter.
     * 
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<any>} return the address of the transaction.
     */
    async cancelConsent(consentId: string, identity: IdentityManager): Promise<any> {
        return consentId + identity;

    }

    /**
     * This function return the consent status based in the consentID passed in the parameter.
     * 
     * @param {string} consentId This parameters is the consentID to indentify the consent.
     * @param {string} owner This parameter is the owner addres.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<any>} return the consent status. 
     */
    async getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<any> {
        return consentId + owner + identity;
    }

    /**
     * This funtion add a key in a consent based in the consentID in the case if the consent
     * has already been acepted.
     * 
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {string} addressConsent This parameter is the adressConsent to indentify the consent.
     * @param {string} key  This parameter is the key to be added in the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<any>}  return the address of the transaction.  
     */
    async addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<any> {
        return consentId + addressConsent + identity + key;
    }

    /**
     * This funtion return the addres's and keys's the consent based in the consentId.
     * 
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<any>} return the addres's and keys's
     */
    async getKeys(consentId: string, identity: IdentityManager): Promise<any> {
        return consentId + identity;
    }

}
/**
 * Class
 */
class AccessInteractionOther implements IAccessInteraction {

    /**
     * This function gives access by making use of the values passed as parameters.
     * 
     * @param {string} resource This parameter is the resource to be shared. 
     * @param {string} consentId This parameter is the id of the consent. 
     * @param {string} accounts This parameter is the accounts to give access.
     * @param {string} resourceName This parameter is the resource name.
     * @param {string} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<any>} Return the trasaction address.
     */
    async giveAccess(resource: string, consentId: string, accounts: string[], resourceName: string, identity: IdentityManager): Promise<any> {
        return resource + consentId + accounts + resourceName + identity;
    }

    /**
     * This function revoke the acces in the resouce using the values passed as parameters.
     * 
     * @param {string} resource This parameter is the resource that will be revoked. 
     * @param {string} consentId This parameter is the id of the consent to revoke access.
     * @param {string} account This parameter is the account that will be revoked.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<any>} Return the trasaction address.
     */
    async revokeAccess(resource: string, consentId: string, account: string, identity: IdentityManager): Promise<any> {
        return resource + consentId + account + identity;
    }
    /**
     * This function check the access in the resource using the consent id and the user address.
     * 
     * @param {string} resource This parameter is the resource to be checked. 
     * @param {string} consentId This parameter is the id of the consent to be checked.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<any>} Return if the user has access in this consent.
     */
    async checkAccess(resource: string, consentId: string, identity: IdentityManager): Promise<any> {
        return resource + consentId + identity;
    }

    /**
     * This function check the resource and it's state.
     * 
     * @param {string} consentId This parameter is the resource to be returned. 
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<any>} Return addres and state of the user in this consent.
     */
    async getResourceByConsent(consentId: string, identity: IdentityManager): Promise<any> {
        return consentId + identity;
    }

}


describe('Testing interaction component using the CLAM implementation', () => {

    test('should the factoryInteraction instance have a good structure', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        const keys = Object.keys(factoryInteraction);
        expect(keys.includes('optionsConsentInteraction')).toBe(true);
        expect(keys.includes('optionsAccessInteraction')).toBe(true);
        expect(keys.length).toBe(2);
    });
    test('should generate an interaction with the clam implementations', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        const interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');
        const keys = Object.keys(interaction);
        expect(keys.includes('acccessInteraction')).toBe(true);
        expect(keys.includes('consentInteraction')).toBe(true);

        expect(keys.length).toBe(2);
    });
    test('should not generate an interaction if we dont specifie the consentInteraction type', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction('not', 'clam', 'clam');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The consentInteraction type doesn\'t exist');

        }
    });
    test('should not generate an interaction if we dont specifie the accessInteraction type', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction('clam', 'not', 'clam');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The accessInteraction type doesn\'t exist');

        }
    });
    test('should add a new implementation to the FactoryInteraction', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        factoryInteraction.setOptionConsentInteraction({ name: 'other', option: ConsentInteractionOther });


    });
    test('should generate an instance of interaction based on the new consent implementation.', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        factoryInteraction.setOptionConsentInteraction({ name: 'other', option: ConsentInteractionOther });
        const interactionOther = factoryInteraction.generateInteraction('other', 'clam', 'clam');

        expect(interactionOther).not.toBe(null);
    });
    test('should generate an instance of interaction based on the new access implementation.', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        factoryInteraction.setOptionAccessInteraction({ name: 'other', option: AccessInteractionOther });
        const interactionOther = factoryInteraction.generateInteraction('clam', 'other', 'clam');

        expect(interactionOther).not.toBe(null);
    });
    test('should generate an instance of interaction based on the new access and consent implementations.', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        factoryInteraction.setOptionAccessInteraction({ name: 'other', option: AccessInteractionOther });
        factoryInteraction.setOptionConsentInteraction({ name: 'other', option: ConsentInteractionOther });
        const interactionOther = factoryInteraction.generateInteraction('other', 'other', 'clam');

        expect(interactionOther).not.toBe(null);
    });


    test('should throw an error if we want to add an existing implementation in consent. ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionConsentInteraction({ name: 'clam', option: ConsentInteractionOther });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('This option already exists.');

        }
    });
    test('should throw an error if we want to add an existing implementation in access. ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionAccessInteraction({ name: 'clam', option: AccessInteractionOther });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('This option already exists.');

        }
    });
    test('should throw an error if we want to add a new implementation of consent with the name empty ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionConsentInteraction({ name: '', option: ConsentInteractionOther });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The name must have at least one character');

        }
    });
    test('should throw an error if we want to add a new implementation of access with the name empty ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionAccessInteraction({ name: '', option: AccessInteractionOther });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The name must have at least one character');

        }
    });
    test('should throw an error if we want to generate an interaction without consent type ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction('', 'clam', 'clam');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The consent implementation name must have a minimum of one character');

        }
    });
    test('should throw an error if we want to generate an interaction without access type ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction('clam', '', 'clam');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The access implementation name must have a minimum of one character');
        }
    });
});

