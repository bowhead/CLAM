import Web3 from 'web3';

/**
 * This class is used to contain the information and configuration 
 * to perform interaction with web 3 and contracts.
 */
class Web3Provider {
    public consentConfig: { address: string; abi: any }
    public accessConfig: { address: string; abi: any }
    public IPFSManagementConfig: { address: string; abi: any }
    public consentResourceConfig: { address: string; abi: any }
    public static instance: Web3Provider;
    public web3Object: Web3;

    /**
     * Empty constructor
     */
    private constructor() { }

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
     * @param {any} consentConfig This parameter is the consent configuration to connect with the contract.
     * @param {any} accessConfig This parameter is the access configuration to connect with the contract.
     * @param {any} consentResourceConfig This parameter is the consentResource configuration to connect with the contract.
     * @param {any} IPFSManagementConfig This parameter is the IPFSManagement configuration to connect with the contract.
     */

    public setConfig(web3Object: Web3, consentConfig: any, accessConfig: any, consentResourceConfig: any, IPFSManagementConfig: any): void {
        this.web3Object = web3Object;
        this.consentConfig = consentConfig;
        this.accessConfig = accessConfig;
        this.consentResourceConfig = consentResourceConfig;
        this.IPFSManagementConfig = IPFSManagementConfig
    }

    /**
     * This function return a new Web3 instance.
     * 
     * @returns {Web3} returna instance of Web3 using the configuration.
     */
    public getProvider(): Web3 {
        return this.web3Object;
    }

}

export default Web3Provider;