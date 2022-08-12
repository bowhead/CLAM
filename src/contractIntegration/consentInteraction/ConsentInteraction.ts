/*globals Promise*/

import { injectable } from 'tsyringe';
import { IConsentInteraction } from '.';
import Web3 from 'web3';
import { IdentityManager } from '../../indentityManager';
import Web3Provider from '../interaction/Wbe3Provider';
/**
 * This class represent the implementation of IConsentInteraction interface,
 * this class is used to interact with the consent smart contract.
 */
@injectable()
class ConsentInteraction implements IConsentInteraction {

    /**
     * This function saves a consent with the information passed as parameters. 
     * 
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<any>} return the address transaction.
     */
    saveConsent(consentId: string, identity: IdentityManager): Promise<any> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.updateConsent(Web3.utils.fromAscii(consentId), true).send(function (error: any, result: any) {
                if (!error) {
                    resolve({ result });
                }
                else {
                    reject(error);
                }
            });
        });

    }

    /**
     * This function cancel a consent based in the consentID passed in th eparameter.
     * 
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<any>} return the address transaction.
     */
    async cancelConsent(consentId: string, identity: IdentityManager): Promise<any> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.updateConsent(Web3.utils.fromAscii(consentId), false).send(function (error: any, result: any) {
                if (!error) {
                    resolve({ result });
                }
                else {
                    reject(error);
                }
            });
        });

    }

    /**
     * This function return the consent status based in the consentID passed in the parameter.
     * 
     * @param {string} consentId This parameters is the consentID to indentify the consent.
     * @param {string} owner This parameter is the owner addres.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<any>} return the consent status. 
     */
    getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<any> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        if (owner.trim() === '' || owner.trim().length === 0) throw new Error('Owner must have at least 1 character');
        if (!owner.trim().includes('0x')) throw new Error('Invalid owner, the string with has a correct format.');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.getConsent(Web3.utils.fromAscii(consentId), owner).call(function (error: any, result: any) {
                if (!error) {
                    resolve({ result });
                }
                else {
                    reject(error);
                }
            });
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
     * @returns {Promise<any>}  return the address transaction.  
     */
    addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<any> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        if (addressConsent.trim() === '' || addressConsent.trim().length === 0) throw new Error('AddressConsent must have at least 1 character');
        if (!addressConsent.trim().includes('0x')) throw new Error('Invalid addressConsent, the string with has a correct format.');
        if (key.trim().length === 0 || key.trim() === '') throw new Error('Key must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.addPGPKey(Web3.utils.fromAscii(consentId), addressConsent, key).send({ gas: '1000000' }, function (error: any, result: any) {
                if (!error) {
                    resolve({ result });
                }
                else {
                    reject(error);
                }
            });
        });
    }

    /**
     * This funtion return the addres's and keys's the consent based in the consentId.
     * 
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<any>} return the addres's and keys's
     */
    getKeys(consentId: string, identity: IdentityManager): Promise<any> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.getPGPKeys(Web3.utils.fromAscii(consentId)).call(function (error: any, result: any) {
                if (!error) {
                    resolve({ result });
                }
                else {
                    reject(error);
                }
            });
        });
    }

}

export default ConsentInteraction;