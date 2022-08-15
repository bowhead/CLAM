import Web3 from 'web3';
/**
 * This class is used to contain the information and configuration 
 * to perform interaction with web 3 and contracts.
 */
class Web3Provider {
    public urlProvider: string;
    public consentConfig: { address: string; abi: any }
    public accessConfig: { address: string; abi: any }
    public consentResourceConfig: { address: string; abi: any }
    public static instance: Web3Provider;

    /**
     * Empty constructor
     */
    private constructor() {
        this.urlProvider = '';

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
     * @param {string} urlProvider This parameter is the url provider. 
     * @param {any} consentConfig This parameter is the consent configuration to connect with the contract.
     * @param {any} accessConfig This parameter is the access configuration to connect with the contract.
     * @param {any} consentResourceConfig This parameter is the consentResource configuration to connect with the contract.
     */
    public setConfig(urlProvider: string, consentConfig: any, accessConfig: any, consentResourceConfig: any): void {

        this.urlProvider = urlProvider;
        this.consentConfig = consentConfig;
        this.accessConfig = accessConfig;
        this.consentResourceConfig = consentResourceConfig;
    }

    /**
     * This function return a new Web3 instance.
     * 
     * @returns {Web3} returna instance of Web3 using the configuration.
     */
    public getProvider(): Web3 {

        const objWeb3 = new Web3(new Web3.providers.HttpProvider(this.urlProvider));
        return objWeb3;
    }
}

export default Web3Provider;