import Web3 from 'web3';
import IInteractionConfig from './IInteractionConfig';

/**
 * This class is used to contain the information and configuration 
 * to perform interaction with web 3 and contracts.
 */
class Web3Provider {
    public interactionConfig: IInteractionConfig;
    public static instance: Web3Provider;
    public web3Object: Web3;

    /**
     * Empty constructor
     */
    private constructor() { // eslint-disable-line @typescript-eslint/no-empty-function

    }

    /**
     * This function returns the instance of the class using the sigleton pattern.
     * 
     * @returns {Web3Provider} return a instance of Web3Provider.
     */
    public static getInstance(): Web3Provider {
        if (!Web3Provider.instance) {

            Web3Provider.instance = new Web3Provider();
        }
        return this.instance;
    }

    /**
     * This function set the configuration to connect with the blockchain.
     * 
     * @param {Web3} web3Object This parameter this parameter Web3Provider.
     * @param {IInteractionConfig} interactionConfig This parameter is the interaction configuration.
     */
    public setConfig(web3Object: Web3, interactionConfig: IInteractionConfig): void {
        this.web3Object = web3Object;
        this.interactionConfig = interactionConfig;
    }

    /**
     * This function return a new Web3 instance.
     * 
     * @returns {Web3} return a instance of Web3 using the configuration.
     */
    public getProvider(): Web3 {
        return this.web3Object;
    }

}

export default Web3Provider;