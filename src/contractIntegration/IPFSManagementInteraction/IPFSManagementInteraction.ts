import { injectable } from 'tsyringe';
import { IIPFSManagementInteraction } from '.';
import Web3 from 'web3';
import { IdentityManager } from '../../indentityManager';
import Web3Provider from '../interaction/Web3Provider';
import IIpfsManagementFiles from './IIPFSManagementFiles';
import { ITransaction } from '../types/ITransaction';

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
     * @returns {void}
     */
    async addFile(fileHash: string, fileName: string, identity: IdentityManager): Promise<void> {
        if (fileHash.trim() === '' || fileHash.trim().length === 0) throw new Error('fileHash must have at least 1 character');
        if (fileName.trim() === '' || fileName.trim().length === 0) throw new Error('fileName must have at least 1 character');

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.IPFSManagementConfig.abi, provider.IPFSManagementConfig.address, { from: identity.address });
        const transaction =  contract.methods.addFile(fileHash, Web3.utils.fromAscii(fileName));
        await this.send(transaction, objWeb3, identity);
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

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.IPFSManagementConfig.abi, provider.IPFSManagementConfig.address, { from: identity.address });

        const transaction = contract.methods.removeFile(fileHash);
        await this.send(transaction, objWeb3, identity);
        return;
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
     * @returns {Promise<IIpfsManagementFiles>} returns file list
     */
    getFiles(identity: IdentityManager): Promise<IIpfsManagementFiles> {
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.IPFSManagementConfig.abi, provider.IPFSManagementConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.getFiles(identity.address).call(function (error: Error, result: IIpfsManagementFiles) {
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

export default IPFSManagementInteraction;
