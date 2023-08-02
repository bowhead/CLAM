import Web3 from 'web3';
import IInteractionConfig from './IInteractionConfig';
/**
 * This class is used to contain the information and configuration
 * to perform interaction with web 3 and contracts.
 */
declare class Web3Provider {
    interactionConfig: IInteractionConfig;
    static instance: Web3Provider;
    web3Object: Web3;
    /**
     * Empty constructor
     */
    private constructor();
    /**
     * This function returns the instance of the class using the sigleton pattern.
     *
     * @returns {Web3Provider} return a instance of Web3Provider.
     */
    static getInstance(): Web3Provider;
    /**
     * This function set the configuration to connect with the blockchain.
     *
     * @param {Web3} web3Object This parameter this parameter Web3Provider.
     * @param {IInteractionConfig} interactionConfig This parameter is the interaction configuration.
     */
    setConfig(web3Object: Web3, interactionConfig: IInteractionConfig): void;
    /**
     * This function return a new Web3 instance.
     *
     * @returns {Web3} return a instance of Web3 using the configuration.
     */
    getProvider(): Web3;
}
export default Web3Provider;
