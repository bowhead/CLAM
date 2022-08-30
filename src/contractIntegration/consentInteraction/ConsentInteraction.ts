/*global Promise*/

import { injectable } from 'tsyringe';
import { IConsentInteraction } from '.';
import Web3 from 'web3';
import { IdentityManager } from '../../indentityManager';
import Web3Provider from '../interaction/Web3Provider';
import IConsentKeys from './IConsentKeys';
import { ITransaction } from '../types/ITransaction';
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
     * @returns {Promise<string>} return the address of the transaction.
     */
    async saveConsent(consentId: string, identity: IdentityManager): Promise<boolean> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        const transaction = contract.methods.updateConsent(Web3.utils.fromAscii(consentId), true);
        const receipt = await this.send(transaction, objWeb3, identity);
        return receipt;
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
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        const transaction = contract.methods.updateConsent(Web3.utils.fromAscii(consentId), false);
        const receipt = await this.send(transaction, objWeb3, identity);
        return receipt;

    }

    /**
     * This function return the consent status based in the consentID passed in the parameter.
     * 
     * @param {string} consentId This parameters is the consentID to indentify the consent.
     * @param {string} owner This parameter is the owner addres.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} return the consent status. 
     */
    getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<boolean> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        if (owner.trim() === '' || owner.trim().length === 0) throw new Error('Owner must have at least 1 character');
        if (!owner.trim().includes('0x')) throw new Error('Invalid owner, the string with has a correct format.');
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.getConsent(Web3.utils.fromAscii(consentId), owner).call(function (error: Error, result: boolean) {
                if (!error) {
                    resolve(result);
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
     * @returns {Promise<string>}  return the address of the transaction.  
     */
    async addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<boolean> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');
        if (addressConsent.trim() === '' || addressConsent.trim().length === 0) throw new Error('AddressConsent must have at least 1 character');
        if (!addressConsent.trim().includes('0x')) throw new Error('Invalid addressConsent, the string with has a correct format.');
        if (key.trim().length === 0 || key.trim() === '') throw new Error('Key must have at least 1 character');


        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        const transaction = contract.methods.addPGPKey(Web3.utils.fromAscii(consentId), addressConsent, key);
        const receipt = await this.send(transaction, objWeb3, identity);
        return receipt;

    }

    /**
     * This funtion return the addres's and keys's the consent based in the consentId.
     * 
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<IConsentKeys>} return the addres's and keys's
     */
    getKeys(consentId: string, identity: IdentityManager): Promise<IConsentKeys> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('contentID must have at least 1 character');


        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.getPGPKeys(Web3.utils.fromAscii(consentId)).call(function (error: Error, result: IConsentKeys) {
                if (!error) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
        });

    }
    /**
     * This function sign the transaction.
     * 
     * @param {ITransaction} transaction This parameter is the transaction object. 
     * @param {Web3} web3 This parameter is the Web3 Provider to sign the transaction. 
     * @param {IdentityManager} identity This parameter is the identity to sign the transaction with it's privateKey. 
     * @returns {Promise<boolean>} Return true if the transaction was successful, false otherwise.
     */
    private async send(transaction: ITransaction, web3: Web3, identity: IdentityManager): Promise<boolean> {
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: await transaction.estimateGas({ from: identity.address }),
            gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
        };
        const signed = await web3.eth.accounts.signTransaction(options, identity.privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction as string);
        return receipt.status;
    }

}

export default ConsentInteraction;