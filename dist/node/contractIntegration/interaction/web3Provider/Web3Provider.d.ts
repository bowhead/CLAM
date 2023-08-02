import { IdentityManager } from '../../../indentityManager';
import IWeb3Provider from './IWeb3Provider';
import IContractActions from './IContractActions';
/**
 * This class is used to interact with the block chain using web3js implementation
 */
declare class Web3Provider implements IWeb3Provider {
    private provider;
    private interactionConfig;
    /**
     * Constructor that initializes the class instance with the provider and configuration.
     *
     * @param {any} provider this is the provider config
     * @param {IInteractionConfig} interactionConfig This is the configuration provider
     */
    constructor(provider: any, interactionConfig: any);
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
     * This function sign the transaction with the identity passed as a parameter.
     * @param {any} transaction this is the transaction object
     * @param {IdentityManager} identity This is the identity to sign the transaction
     * @returns {Promise<any>} return the transaction receipt
     */
    signTransaction(transaction: any, identity: IdentityManager): Promise<any>;
}
export default Web3Provider;
