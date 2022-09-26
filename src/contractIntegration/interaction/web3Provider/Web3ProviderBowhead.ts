/* eslint-disable  @typescript-eslint/no-explicit-any */

//eslint-disable-next-line
const Web3Bowhead = require('bowhead-web3');
import { IdentityManager } from '../../../indentityManager';
import IInteractionConfig from '../IInteractionConfig';
import IWeb3Provider from './IWeb3Provider';
//eslint-disable-next-line
import { injectable, inject } from 'tsyringe';
import FactoryWeb3Interaction from './FactoryWeb3Interaction';
import IContractActions from './IContractActions';
import NonceManager from './nonceManager/NonceManager';
//eslint-disable-next-line
const Tx = require('ethereumjs-tx').Transaction;
//eslint-disable-next-line
const Common = require('ethereumjs-common').default;
/**
 * This class is used to use bowhead-network and web3js library
 * 
 */
@injectable()
class Web3ProviderBowhead implements IWeb3Provider {
    private provider: typeof Web3Bowhead;
    private nonceManager: NonceManager;
    private interactionConfig: IInteractionConfig;

    /**
     * Constructor that initializes the class instance with the provider and configuration.
     * 
     * @param {any} provider this is the provider config
     * @param {IInteractionConfig} interactionConfig This is the configuration provider
     */
    constructor(@inject("Provider") provider: any, @inject("Config") interactionConfig: IInteractionConfig) {
        this.provider = new Web3Bowhead(new Web3Bowhead.providers.HttpProvider(provider));
        this.interactionConfig = interactionConfig;
        this.nonceManager = new NonceManager('cache', 0);
    }
    /**
     * This function returns the contract methods.
     * 
     * @param {string} interactionType contract name
     * @returns {any} contract methods
     */
    getMethods(interactionType: string) {
        let abi: any;
        let address = '';
        if (interactionType.trim().toLowerCase() === 'consent') {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        } else if (interactionType.trim().toLowerCase() === 'access') {
            abi = this.interactionConfig.access.abi;
            address = this.interactionConfig.access.address;
        } else {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        }
        //eslint-disable-next-line
        const contract = new this.provider.aht.contract(abi).at(address);
        return contract;
    }

    /**
     * This function use the contract method.
     * 
     * @param {any} contract This is the contract.
     * @param {IdentityManager} identity This is the identity to interact with the block chain
     * @param {IContractActions} options This is the actions to do in the block chain
     * @param {any} params Extra parameters
     * @returns {any} Return the result of the block chain transaction
     */
    async useContractMethod(contract: any, identity: IdentityManager, options: IContractActions, ...params: any[]) {
        try {
            if (options.action.trim() === 'send') {
                const nonce: number = await this.getNonce(identity.address);
                this.nonceManager.save(nonce > this.nonceManager.get() ? nonce : this.nonceManager.get());
                //eslint-disable-next-line
                const rawTx = {
                    'to': FactoryWeb3Interaction.getInstance().config.consent.address,
                    'nonce': this.provider.toHex(this.nonceManager.get()),
                    'gasPrice': 0,
                    'gasLimit': 50000000,
                    'value': '0x0',
                    'data': contract[options.methodName].getData.apply(contract, params),
                    'chainId': FactoryWeb3Interaction.getInstance().config.chainId,
                };
                //eslint-disable-next-line
                const bufferTransaction = await this.signTransaction(rawTx, identity);
                const hash = await this.sendSignedTransaction(bufferTransaction);
                const result = await this.getTransactionReceipt(hash);
                this.nonceManager.save(this.nonceManager.get() + 1);
                return result;
            } else {
                const fn = contract[options.methodName].bind(
                    contract,
                    ...params,
                    { from: identity.address }
                );
                //eslint-disable-next-line
                const result = await this.promersify(fn);
                return result;
            }
        } catch (__error) {
            return false;
        }
    }

    /**
     * This function return the nonce value
     * @param {string} userAddress this method return the user nonce 
     * @returns {Promise<number>} returns the nonce value
     */
    getNonce(userAddress: string): Promise<number> {
        return new Promise((resolve, reject) => {
            //eslint-disable-next-line
            this.provider.aht.getTransactionCount(userAddress, (err: Error, nonce: number) => {
                if (err) {
                    reject({
                        'status': 500,
                        //eslint-disable-next-line
                        'message': 'Blockchain error: calculating the nonce',
                        'systemMessage': err,
                    });
                    return;
                }
                resolve(nonce);
            });
        });
    }

    /**
     * This function sign the transaction using the identity passed as a parameter.
     * @param {any} transaction the transaction object 
     * @param {IdentityManager} identity the identity to sign the transaction.
     * @returns {Promise<any>} the transaction hash in buffer object.
     */
    async signTransaction(transaction: any, identity: IdentityManager): Promise<any> {
        const customCommon = Common.forCustomChain(
            //eslint-disable-next-line
            'mainnet',
            {
                //eslint-disable-next-line
                'name': 'aht',
                'chainId': transaction.chainId,
            },
            //eslint-disable-next-line
            'petersburg',
        );
        //eslint-disable-next-line
        const tx = new Tx(transaction, { 'common': customCommon, });
        //eslint-disable-next-line
        tx.sign(Buffer.from(identity.privateKey.substring(2, identity.privateKey.length), 'hex'));
        //eslint-disable-next-line
        return tx.serialize();
    }

    /**
     * This function send a transaction signed
     * @param {Buffer} tx this is the buffer result 
     * @returns {Promise<string>} return the hash of the transaction
     */
    //eslint-disable-next-line
    sendSignedTransaction(tx: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            //eslint-disable-next-line
            this.provider.aht.sendRawTransaction('0x' + tx.toString('hex'), (err: Error, hash: string) => {
                if (err) {
                    reject({
                        'status': 500,
                        //eslint-disable-next-line
                        'message': 'Blockchain Error: sending transaction',
                        'systemMessage': err,
                    });
                }
                resolve(hash);
            });
        });
    }

    /**
     * This function return the transaction receipt using the transaction hash passed as a parameter.
     * 
     * @param {string} txHash Transaction hash
     * @returns {Promise<any>} return the transaction receipt
     */
    //eslint-disable-next-line
    getTransactionReceipt(txHash: string): Promise<any> {
        return new Promise((resolve, reject) => {
            //eslint-disable-next-line
            this.provider.aht.getTransactionReceipt(txHash, (err: Error, result: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    /**
     * This functions return a promise with the return of the callback function
     * @param {Function} fn callback tu run
     * @returns {Promise<any>} The result of the callback in a promise
     */
    //eslint-disable-next-line
    promersify(fn: Function) {
        return new Promise((resolve, reject) => {
            fn((err: Error, result: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

}

export default Web3ProviderBowhead;