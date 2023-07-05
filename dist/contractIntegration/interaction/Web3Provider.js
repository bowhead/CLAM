"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class is used to contain the information and configuration
 * to perform interaction with web 3 and contracts.
 */
class Web3Provider {
    /**
     * Empty constructor
     */
    constructor() {
    }
    /**
     * This function returns the instance of the class using the sigleton pattern.
     *
     * @returns {Web3Provider} return a instance of Web3Provider.
     */
    static getInstance() {
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
    setConfig(web3Object, interactionConfig) {
        this.web3Object = web3Object;
        this.interactionConfig = interactionConfig;
    }
    /**
     * This function return a new Web3 instance.
     *
     * @returns {Web3} return a instance of Web3 using the configuration.
     */
    getProvider() {
        return this.web3Object;
    }
}
exports.default = Web3Provider;
//# sourceMappingURL=Web3Provider.js.map