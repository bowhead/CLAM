import 'reflect-metadata';
import IInteractionConfig from '../IInteractionConfig';
import IOption from '../IOption';
import IWeb3Provider from './IWeb3Provider';
/**
 * This class is used to create Web3Interactions
 */
declare class FactoryWeb3Interaction {
    config: IInteractionConfig;
    private web3Providers;
    static instance: FactoryWeb3Interaction;
    /**
     * Constructor that initializes the instance of the class
     * by setting the 2 providers of the library
     */
    private constructor();
    /**
     * This method return a instance of FactoryWeb3Interaction
     * @returns {FactoryWeb3Interaction} instance of this clase.
     */
    static getInstance(): FactoryWeb3Interaction;
    /**
     * This method set a new configuration to use in the interactions object.
     * @param {IInteractionConfig} config new configuration.
     */
    setConfig(config: IInteractionConfig): void;
    /**
     * This method add a new Web3Provider implementation
     * @param {IOption} option implementation options
     */
    setOptionWeb3Provider(option: IOption): void;
    /**
     * This method generate the a type of interaction with the parameter passed as a parameter..
     * @param {string} providerType Type of provider.
     * @returns {IWeb3Provider} a new Web3Provider implementation
     */
    generateWeb3Provider(providerType: string): IWeb3Provider;
}
export default FactoryWeb3Interaction;
