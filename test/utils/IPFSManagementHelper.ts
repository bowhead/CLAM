import { getInstance } from './web3Helper';
import Web3 from 'web3';

export default class IPFSManagement {
    web3: Web3;
    contract: any;
    user: string;
    private privatekey: string;

    /**
     * Initialize contract instance.
     * @param {string} contractName - Smart contract name.
     * @param {string} contractAddress - Smart contract address.
     * @param {string} userAddress - User address to sign transactions
     * @param {string} privateKey - User private key
     */
     constructor (contractName : string, contractAddress : string, userAddress : string, privateKey: string) {
        this.web3 = getInstance();
        const abiContract = require(`./${contractName}.json`);
        this.contract = new this.web3.eth.Contract(abiContract.abi, contractAddress, {
            from: userAddress
        });
        this.user = userAddress;
        this.privatekey = privateKey;
    }

    /**
     * Added new file
     * @param {string} fileHash - File identifier
     * @param {string} name - File name
     * @returns 
     */
    async addFile(fileHash: string, name: string) {
        const fileName = this.web3.utils.fromAscii(name);

        const transaction = this.contract.methods.addFile(fileHash, fileName);
        const receipt = await this.send(273418515, transaction);

        return receipt;
    }
    
    private async send(gasPrice: number, transaction: any) {
        const options = {
            to : transaction._parent._address,
            data : transaction.encodeABI(),
            gas : await transaction.estimateGas({from: this.user}),
            gasPrice: gasPrice
        };
        const signed  = await this.web3.eth.accounts.signTransaction(options, this.privatekey);
        const receipt = await this.web3.eth.sendSignedTransaction(signed.rawTransaction as string);
        
        return receipt;
    }

}