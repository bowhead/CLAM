/// <reference types="node" />
import { IdentityManager } from '../../../indentityManager';
import IInteractionConfig from '../IInteractionConfig';
import IWeb3Provider from './IWeb3Provider';
import IContractActions from './IContractActions';
/**
 * This class is used to use bowhead-network and web3js library
 *
 */
declare class Web3ProviderBowhead implements IWeb3Provider {
    private provider;
    private nonceManager;
    private interactionConfig;
    /**
     * Constructor that initializes the class instance with the provider and configuration.
     *
     * @param {any} provider this is the provider config
     * @param {IInteractionConfig} interactionConfig This is the configuration provider
     */
    constructor(provider: any, interactionConfig: IInteractionConfig);
    /**
     * This function returns the contract methods.
     *
     * @param {string} interactionType contract name
     * @returns {any} contract methods
     */
    getMethods(interactionType: string): any;
    /**
     * This function use the contract method.
     *
     * @param {any} contract This is the contract.
     * @param {IdentityManager} identity This is the identity to interact with the block chain
     * @param {IContractActions} options This is the actions to do in the block chain
     * @param {any} params Extra parameters
     * @returns {any} Return the result of the block chain transaction
     */
    useContractMethod(contract: any, identity: IdentityManager, options: IContractActions, ...params: any[]): Promise<any>;
    /**
     * This function return the nonce value
     * @param {string} userAddress this method return the user nonce
     * @returns {Promise<number>} returns the nonce value
     */
    getNonce(userAddress: string): Promise<number>;
    /**
     * This function sign the transaction using the identity passed as a parameter.
     * @param {any} transaction the transaction object
     * @param {IdentityManager} identity the identity to sign the transaction.
     * @returns {Promise<any>} the transaction hash in buffer object.
     */
    signTransaction(transaction: any, identity: IdentityManager): Promise<any>;
    /**
     * This function send a transaction signed
     * @param {Buffer} tx this is the buffer result
     * @returns {Promise<string>} return the hash of the transaction
     */
    sendSignedTransaction(tx: Buffer): Promise<string>;
    /**
     * This function return the transaction receipt using the transaction hash passed as a parameter.
     *
     * @param {string} txHash Transaction hash
     * @returns {Promise<any>} return the transaction receipt
     */
    getTransactionReceipt(txHash: string): Promise<any>;
    /**
     * This functions return a promise with the return of the callback function
     * @param {Function} fn callback tu run
     * @returns {Promise<any>} The result of the callback in a promise
     */
    promersify(fn: Function): Promise<unknown>;
}
export default Web3ProviderBowhead;
