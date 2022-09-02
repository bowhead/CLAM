/*global expect, test, describe*/
require('dotenv').config();

import { IdentityManager } from '../src';
import { FactoryInteraction, IAccessInteraction, IConsentInteraction } from '../src/contractIntegration';
import IInteractionConfig from '../src/contractIntegration/interaction/IInteractionConfig';
import FactoryWeb3Interaction from '../src/contractIntegration/interaction/web3Provider/FactoryWeb3Interaction';



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
    let factoryWeb3Provider: FactoryWeb3Interaction;

    beforeEach(() => {
        factoryWeb3Provider = FactoryWeb3Interaction.getInstance();
        const interactionConfig: IInteractionConfig = {
            provider: String(process.env.CLAM_BLOCKCHAIN_LOCALTION),
            consent: { address: String(process.env.CLAM_CONSENT_ADDRESS), abi: "a" },
            access: { address: String(process.env.CLAM_ACCESS_ADDRESS), abi: "a" },
            consentResource: { address: String(process.env.CLAM_CONSENT_RESOURCE_ADDRESS), abi: "a" },
            ipfs: { address: String(process.env.CLAM_IPFS_ADDRESS), abi: "a" }
        }
        factoryWeb3Provider.setConfig(interactionConfig);
    })
    test('should the factoryInteraction instance have a good structure', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        const keys = Object.keys(factoryInteraction);
        expect(keys.includes('optionsConsentInteraction')).toBe(true);
        expect(keys.includes('optionsAccessInteraction')).toBe(true);
        expect(keys.includes('optionsIPFSManagementInteraction')).toBe(true);
        expect(keys.length).toBe(3);
    });

    test('should generate an interaction with the clam implementations', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        const interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');
        const keys = Object.keys(interaction);
        expect(keys.includes('acccessInteraction')).toBe(true);
        expect(keys.includes('consentInteraction')).toBe(true);
        expect(keys.includes('IPFSManagementInteraction')).toBe(true);
        expect(keys.length).toBe(3);
    });

    test('should not generate an interaction if we dont specifie the consentInteraction type', async () => {
        await expect(async () => {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction('not', 'clam', 'clam');
        }).rejects.toThrow(`The consentInteraction type doesn\'t exist`);
    });

    test('should not generate an interaction if we dont specifie the accessInteraction type', async () => {
        await expect(async () => {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction('clam', 'not', 'clam');
        }).rejects.toThrow('The accessInteraction type doesn\'t exist');
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

    test('should throw an error if we want to add an existing implementation in consent. ', async () => {
        await expect(async () => {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionConsentInteraction({ name: 'clam', option: ConsentInteractionOther });
        }).rejects.toThrow('This option already exists.');
    });

    test('should throw an error if we want to add an existing implementation in access. ', async () => {
        await expect(async () => {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionAccessInteraction({ name: 'clam', option: AccessInteractionOther });
        }).rejects.toThrow('This option already exists.');
    });

    test('should throw an error if we want to add a new implementation of consent with the name empty ', async () => {
        await expect(async () => {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionConsentInteraction({ name: '', option: ConsentInteractionOther });
        }).rejects.toThrow('The name must have at least one character');
    });

    test('should throw an error if we want to add a new implementation of access with the name empty ', async () => {
        await expect(async () => {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionAccessInteraction({ name: '', option: AccessInteractionOther });
        }).rejects.toThrow('The name must have at least one character');
    });

    test('should throw an error if we want to generate an interaction without consent type ', async () => {
        await expect(async () => {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction('', 'clam', 'clam');
        }).rejects.toThrow('The consent implementation name must have a minimum of one character');
    });

    test('should throw an error if we want to generate an interaction without access type ', async () => {
        await expect(async () => {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction('clam', '', 'clam');
        }).rejects.toThrow('The access implementation name must have a minimum of one character');
    });
});

