import { injectable } from 'tsyringe';
import { IIPFSManagementInteraction } from '.';
import Web3 from 'web3';
import { IdentityManager } from '../../indentityManager';
import Web3Provider from '../interaction/Wbe3Provider';
import IIPFSManagementFiles from './IIPFSManagementFiles';

/**
 * Implementation of IIPFSManagementInteraction interface
 * Interact with the IPFS management contract
 */
@injectable()
class IPFSManagementInteraction implements IIPFSManagementInteraction {

    /**
     * Add file to IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {string} fileName - File name
     * @param {IdentityManager} identity - Identity of the file owner
     * @returns void
     */
    addFile(fileHash: string, fileName: string, identity: IdentityManager): Promise<void> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');
        if (fileName.trim() === '' || fileName.trim().length === 0) throw new Error('fileName must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.IPFSManagementConfig.abi, provider.IPFSManagementConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            contract.methods.addFile(fileHash, Web3.utils.fromAscii(fileName)).send(function (error: Error) {
                if (!error) {
                    resolve();
                }
                else {
                    reject(error);
                }
            });
        });
    }

    /**
     * Remove file from IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - Identity of the file owner
     * @returns void
     */
    removeFile(fileHash: string, identity: IdentityManager): Promise<void> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.IPFSManagementConfig.abi, provider.IPFSManagementConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            contract.methods.removeFile(fileHash).send(function (error: Error) {
                if (!error) {
                    resolve();
                }
                else {
                    reject(error);
                }
            });
        });
    }

    /**
     * Check if the user can access to the file
     * @param {string} fileHash - File identifier or location 
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if has access, false if not
     */
    checkAccess(fileHash: string, identity: IdentityManager): Promise<boolean> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.IPFSManagementConfig.abi, provider.IPFSManagementConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            contract.methods.checkAccess(identity.address, fileHash).call(function (error: Error, result: boolean) {
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
     * Check if the file is available
     * @param {string} fileHash - File identifier or location 
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if is available, false if not
     */
    fileIsAvailable(fileHash: string, identity: IdentityManager): Promise<boolean> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.IPFSManagementConfig.abi, provider.IPFSManagementConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            contract.methods.fileIsAvailable(identity.address, fileHash).call(function (error: Error, result: boolean) {
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
     * Get list of user files
     * @param {IdentityManager} identity - User identity 
     * @returns {Promise<IIPFSManagementFiles>} returns file list
     */
    getFiles(identity: IdentityManager): Promise<IIPFSManagementFiles> {
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.IPFSManagementConfig.abi, provider.IPFSManagementConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.getFiles(identity.address).call(function (error: Error, result: IIPFSManagementFiles) {
                if (!error) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
        });
    }
}

export default IPFSManagementInteraction;
