/*globals Promise*/
require('dotenv').config();
import { injectable } from 'tsyringe';
import { IConsentInteraction } from '.';
import Web3 from 'web3';
import { IdentityManager } from '../../indentityManager';
import IConsentKeys from './IConsentKeys';
import FactoryWeb3Interaction from '../interaction/web3Provider/FactoryWeb3Interaction';
import IWeb3Provider from '../interaction/web3Provider/IWeb3Provider';
import IContractActions from '../interaction/web3Provider/IContractActions';

/**
 * This class represent the implementation of IConsentInteraction interface,
 * this class is used to interact with the consent smart contract.
 */
@injectable()
class ConsentInteraction implements IConsentInteraction {
    private provider: IWeb3Provider = FactoryWeb3Interaction.getInstance().generateWeb3Provider("web3");

    /**
     * This function saves a consent with the information passed as parameters. 
     * 
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} return the address of the transaction.
     */
    async saveConsent(consentId: string, identity: IdentityManager): Promise<boolean> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        const contract = this.provider.getMethods('consent');
        const options: IContractActions = {
            action: 'send',
            methodName: 'updateConsent'
        }
        const result = await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId), true);
        return result.status;
    }

    /**
     * This function cancel a consent based in the consentID passed in the parameter.
     * 
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} return the address of the transaction.
     */
    async cancelConsent(consentId: string, identity: IdentityManager): Promise<boolean> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        const contract = this.provider.getMethods('consent');
        const options: IContractActions = {
            action: 'send',
            methodName: 'updateConsent'
        }
        const result = await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId), false);
        return result.status;
    }

    /**
     * This function return the consent status based in the consentID passed in the parameter.
     * 
     * @param {string} consentId This parameters is the consentID to indentify the consent.
     * @param {string} owner This parameter is the owner addres.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} return the consent status. 
     */
    async getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<boolean> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        if (owner.trim() === '' || owner.trim().length === 0) throw new Error('Owner must have at least 1 character');
        if (!owner.trim().includes('0x')) throw new Error('Invalid owner, the string with has a correct format.');
        const contract = this.provider.getMethods('consent');
        const options: IContractActions = {
            action: 'call',
            methodName: 'getConsent'
        }
        return await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId), owner)
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
    async addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<boolean> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        if (addressConsent.trim() === '' || addressConsent.trim().length === 0) throw new Error('AddressConsent must have at least 1 character');
        if (!addressConsent.trim().includes('0x')) throw new Error('Invalid addressConsent, the string with has a correct format.');
        if (key.trim().length === 0 || key.trim() === '') throw new Error('Key must have at least 1 character');
        const contract = this.provider.getMethods('consent');
        const options: IContractActions = {
            action: 'send',
            methodName: 'addPGPKey'
        }
        const result =  await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId), addressConsent, key);
        return result.status;
    }

    /**
     * This funtion return the addres's and keys's the consent based in the consentId.
     * 
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<IConsentKeys>} return the addres's and keys's
     */
    async getKeys(consentId: string, identity: IdentityManager): Promise<IConsentKeys> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        const contract = this.provider.getMethods('consent');
        const options: IContractActions = {
            action: 'call',
            methodName: 'getPGPKeys'
        }
        return await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId));

    }
}

export default ConsentInteraction;