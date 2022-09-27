import 'reflect-metadata';
import { container } from 'tsyringe';

import IInteractionConfig from '../IInteractionConfig';
import IOption from '../IOption';
import IWeb3Provider from './IWeb3Provider';
import Web3Provider from './Web3Provider';
import Web3ProviderBowhead from './Web3ProviderBowhead';


/**
 * This class is used to create Web3Interactions
 */
class FactoryWeb3Interaction {
    public config: IInteractionConfig;
    private web3Providers: IOption[];
    public static instance: FactoryWeb3Interaction;
    /**
     * Constructor that initializes the instance of the class 
     * by setting the 2 providers of the library
     */
    private constructor() {
        this.web3Providers =[
            { name: 'web3', option: Web3Provider },
            { name: 'bowhead', option: Web3ProviderBowhead }
        ];
    };

    /**
     * This method return a instance of FactoryWeb3Interaction
     * @returns {FactoryWeb3Interaction} instance of this clase.
     */
    public static getInstance(): FactoryWeb3Interaction {
        if (!FactoryWeb3Interaction.instance) {
            this.instance = new FactoryWeb3Interaction();
        }
        return this.instance;
    }
    
    /**
     * This method set a new configuration to use in the interactions object.
     * @param {IInteractionConfig} config new configuration.
     */
    public setConfig(config: IInteractionConfig): void {
        this.config = config;
    }

    /**
     * This method add a new Web3Provider implementation
     * @param {IOption} option implementation options 
     */
    public setOptionWeb3Provider(option: IOption): void {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionWeb3Provider = this.web3Providers.find(optionAux => optionAux.name === option.name);
        if (optionWeb3Provider) {
            throw new Error('This option already exists.');
        }
        this.web3Providers.push(option);
    }

    /**
     * This method generate the a type of interaction with the parameter passed as a parameter..
     * @param {string} providerType Type of provider. 
     * @returns {IWeb3Provider} a new Web3Provider implementation
     */
    public generateWeb3Provider(providerType: string): IWeb3Provider {
        if (providerType.trim().length === 0 || providerType.trim() === '') {
            throw new Error('The name must have at least one character');
        }
        const web3Provider = this.web3Providers.find(option => option.name.trim().toLowerCase() === providerType.trim().toLowerCase());
        if (!web3Provider) throw new Error('The web3 provider type doesn\'t exist');

        container.register('Provider', { useValue: this.config.provider });
        container.register('Config', { useValue: this.config });
        const provider: IWeb3Provider = container.resolve(web3Provider.option);
        return provider;
    }



}

export default FactoryWeb3Interaction;