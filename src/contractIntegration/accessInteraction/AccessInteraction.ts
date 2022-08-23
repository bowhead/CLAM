/*global Promise*/
import { injectable } from 'tsyringe';
import { IAccessInteraction } from '.';

import Web3 from 'web3';
import { IdentityManager } from '../../indentityManager';
import Web3Provider from '../interaction/Wbe3Provider';
import IAccessResource from './IAccessResource';

/**
 * This class is the implementation of IAccessInteraction inteface,
 * this class is used to communicate with Access smart contract.
 * 
 */
@injectable()
class AccessInteraction implements IAccessInteraction {

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

    async giveAccess(resource: string, consentId: string, accounts: string[], resourceName: string, identity: IdentityManager): Promise<boolean> {
        if (resource.trim() === '' || resource.trim().length === 0) throw new Error('The resource must have at least one character');
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('The consentID must have at least one character');
        if (accounts.length === 0) throw new Error('Accounts must have at least one element');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.accessConfig.abi, provider.accessConfig.address, { from: identity.address });
        const resourceBytes = Web3.utils.fromAscii(resource);
        const consentIdBytes = Web3.utils.fromAscii(consentId);
        const resourceNameBytes = Web3.utils.fromAscii(resourceName);
        const transaction = contract.methods.giveAccess(resource, consentIdBytes, accounts, resourceNameBytes);
        const receipt = await this.send(transaction, objWeb3, identity);
        return receipt;
    }

    /**
     * This function check the access in the resource using the consent id and the user address.
     * 
     * @param {string} resource This parameter is the resource to be checked. 
     * @param {string} consentId This parameter is the id of the consent to be checked.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<boolean>} Return if the user has access in this consent.
     */
    async checkAccess(resource: string, consentId: string, identity: IdentityManager): Promise<boolean> {
        if (resource.trim() === '' || resource.trim().length === 0) throw new Error('The resource must have at least one character');
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('The consentID must have at least one character');


        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.accessConfig.abi, provider.accessConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            const consentIdBytes = Web3.utils.fromAscii(consentId);
            contract.methods.checkAccess(resource, consentIdBytes).call(function (error: Error, result: boolean) {
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
     * This function check the resource and it's state.
     * 
     * @param {string} consentId This parameter is the resource to be returned. 
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<IAccessResource>} Return addres and state of the user in this consent.
     */
    async getResourceByConsent(consentId: string, identity: IdentityManager): Promise<IAccessResource> {
        if (consentId.trim() === '' || consentId.trim().length === 0) throw new Error('The consentID must have at least one character');


        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.accessConfig.abi, provider.accessConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            const consentIdBytes = Web3.utils.fromAscii(consentId);
            contract.methods.getResourceByConsent(consentIdBytes).call(function (error: Error, result: IAccessResource) {
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
     * @param {any} transaction This parameter is the transaction object. 
     * @param {Web3} web3 This parameter is the Web3 Provider to sign the transaction. 
     * @param {IdentityManager} identity This parameter is the identity to sign the transaction with it's privateKey. 
     * @returns {Promise<boolean>} Return true if the transaction was successful, false otherwise.
     */
    private async send(transaction: any, web3: Web3, identity: IdentityManager): Promise<boolean> {
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


export default AccessInteraction;