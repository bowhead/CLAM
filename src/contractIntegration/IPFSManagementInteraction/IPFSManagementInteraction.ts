import { injectable } from 'tsyringe';
import { IIPFSManagementInteraction } from '.';
import Web3 from 'web3';
import { IdentityManager } from '../../indentityManager';
import IIpfsManagementFiles from './IIPFSManagementFiles';
import FactoryWeb3Interaction from '../interaction/web3Provider/FactoryWeb3Interaction';
import IWeb3Provider from '../interaction/web3Provider/IWeb3Provider';
import IContractActions from '../interaction/web3Provider/IContractActions';

/**
 * Implementation of IIPFSManagementInteraction interface
 * Interact with the IPFS management contract
 */
@injectable()
class IPFSManagementInteraction implements IIPFSManagementInteraction {
    private provider: IWeb3Provider = FactoryWeb3Interaction.getInstance().generateWeb3Provider("web3");
    /**
     * Add file to IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {string} fileName - File name
     * @param {IdentityManager} identity - Identity of the file owner
     * @returns {void}
     */
    async addFile(fileHash: string, fileName: string, identity: IdentityManager): Promise<void> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');
        if (fileName.trim() === '' || fileName.trim().length === 0) throw new Error('fileName must have at least 1 character');
        const contract = this.provider.getMethods('IPFS');
        const options: IContractActions = {
            action: 'send',
            methodName: 'addFile'
        }
        await this.provider.useContractMethod(contract, identity, options, fileHash, Web3.utils.fromAscii(fileName));
        return;
    }

    /**
     * Remove file from IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - Identity of the file owner
     * @returns {void}
     */
    async removeFile(fileHash: string, identity: IdentityManager): Promise<void> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');
        const contract = this.provider.getMethods('IPFS');
        const options: IContractActions = {
            action: 'send',
            methodName: 'removeFile'
        }
        await this.provider.useContractMethod(contract, identity, options, fileHash);
        return;
    }

    /**
     * Check if the user can access to the file
     * @param {string} fileHash - File identifier or location 
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if has access, false if not
     */
    async checkAccess(fileHash: string, identity: IdentityManager): Promise<boolean> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');

        const contract = this.provider.getMethods('IPFS');
        const options: IContractActions = {
            action: 'call',
            methodName: 'checkAccess'
        }
        const result = await this.provider.useContractMethod(contract, identity, options, identity.address, fileHash)
        return result;
    }

    /**
     * Check if the file is available
     * @param {string} fileHash - File identifier or location 
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if is available, false if not
     */
    async fileIsAvailable(fileHash: string, identity: IdentityManager): Promise<boolean> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');

        const contract = this.provider.getMethods('IPFS');
        const options: IContractActions = {
            action: 'call',
            methodName: 'fileIsAvailable'
        }
        const result = await this.provider.useContractMethod(contract, identity, options, identity.address, fileHash)
        return result;
    }

    /**
     * Get list of user files
     * @param {IdentityManager} identity - User identity 
     * @returns {Promise<IIpfsManagementFiles>} returns file list
     */
    async getFiles(identity: IdentityManager): Promise<IIpfsManagementFiles> {

        const contract = this.provider.getMethods('IPFS');
        const options: IContractActions = {
            action: 'call',
            methodName: 'getFiles'
        }
        const result = await this.provider.useContractMethod(contract, identity, options, identity.address)
        return result;
    }

}

export default IPFSManagementInteraction;
