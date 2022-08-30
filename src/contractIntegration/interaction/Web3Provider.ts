import Web3 from 'web3';
import { IContractConfig } from './types/IContractConfig';

/**
 * This class is used to contain the information and configuration 
 * to perform interaction with web 3 and contracts.
 */
class Web3Provider {
    public consentConfig: IContractConfig;
    public accessConfig: IContractConfig;
    public IPFSManagementConfig: IContractConfig;
    public consentResourceConfig: IContractConfig;
    public static instance: Web3Provider;
    public web3Object: Web3;

    /**
     * This function returns the instance of the class using the singleton pattern.
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
     * This function set the configuration to connect with the block-chain.
     * 
     * @param {Web3} web3Object This parameter this parameter Web3Provider.
     * @param {IContractConfig} consentConfig This parameter is the consent configuration to connect with the contract.
     * @param {IContractConfig} accessConfig This parameter is the access configuration to connect with the contract.
     * @param {IContractConfig} consentResourceConfig This parameter is the consentResource configuration to connect with the contract.
     * @param {IContractConfig} IPFSManagementConfig This parameter is the IPFSManagement configuration to connect with the contract.
     */
    public setConfig(web3Object: Web3, consentConfig: IContractConfig, accessConfig: IContractConfig, consentResourceConfig: IContractConfig, IPFSManagementConfig: IContractConfig): void {
        this.web3Object = web3Object;
        this.consentConfig = consentConfig;
        this.accessConfig = accessConfig;
        this.consentResourceConfig = consentResourceConfig;
        this.IPFSManagementConfig = IPFSManagementConfig;
    }

    /**
     * This function return a new Web3 instance.
     * 
     * @returns {Web3} return instance of Web3 using the configuration.
     */
    public getProvider(): Web3 {
        return this.web3Object;
    }

}

export default Web3Provider;