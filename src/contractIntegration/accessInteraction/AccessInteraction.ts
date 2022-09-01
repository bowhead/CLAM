/*global Promise*/
import { injectable } from 'tsyringe';
import { IAccessInteraction } from '.';
import Web3 from 'web3';
import { IdentityManager } from '../../indentityManager';
import IAccessResource from './IAccessResource';
import IWeb3Provider from '../interaction/web3Provider/IWeb3Provider';
import FactoryWeb3Interaction from '../interaction/web3Provider/FactoryWeb3Interaction';

/**
 * 
 * This class is the implementation of IAccessInteraction interface,
 * this class is used to communicate with Access smart contract.
 * 
 */
@injectable()
class AccessInteraction implements IAccessInteraction {
    private provider: IWeb3Provider = FactoryWeb3Interaction.getInstance().generateWeb3Provider("web3");

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
        const transaction = this.provider.getMethods("access").giveAccess(resource, Web3.utils.fromAscii(consentId), accounts, Web3.utils.fromAscii(resourceName));
        const receipt = await this.provider.signTransaction(transaction, identity);
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
        return new Promise((resolve, reject) => {
            this.provider.getMethods("access").checkAccess(resource, Web3.utils.fromAscii(consentId)).call({ from: identity.address }, function (error: Error, result: boolean) {
                if (!error) resolve(result);
                else reject(error);
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
        return new Promise((resolve, reject) => {
            const consentIdBytes = Web3.utils.fromAscii(consentId);
            this.provider.getMethods("access").getResourceByConsent(consentIdBytes).call({ from: identity.address }, function (error: Error, result: IAccessResource) {
                if (!error) resolve(result);
                else reject(error);
            });
        });

    }

}


export default AccessInteraction;