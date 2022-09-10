import 'reflect-metadata';
import { container } from 'tsyringe';

import IInteractionConfig from "../IInteractionConfig";
import IOption from "../IOption";
import IWeb3Provider from './IWeb3Provider';
import Web3Provider from "./Web3Provider";
import Web3ProviderBowhead from "./Web3ProviderBowhead";


class FactoryWeb3Interaction {
    public config: IInteractionConfig;
    private web3Providers: IOption[];
    public static intance: FactoryWeb3Interaction;

    private constructor() {
        this.web3Providers = [
            { name: "web3", option: Web3Provider },
            { name: "bowhead", option: Web3ProviderBowhead }
        ];
    };

    public static getInstance(): FactoryWeb3Interaction {
        if (!FactoryWeb3Interaction.intance) {
            this.intance = new FactoryWeb3Interaction();
        }
        return this.intance;
    }
    
    public setConfig(config: IInteractionConfig): void {
        this.config = config;
    }

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

    public generateWeb3Provider(providerType: string): IWeb3Provider {
        if (providerType.trim().length === 0 || providerType.trim() === '') {
            throw new Error("The name must have at least one character");
        }
        const web3Provider = this.web3Providers.find(option => option.name.trim().toLowerCase() === providerType.trim().toLowerCase());
        if (!web3Provider) throw new Error('The web3 provider type doesn\'t exist');

        container.register("Provider", { useValue: this.config.provider });
        container.register("Config", { useValue: this.config });
        const provider: IWeb3Provider = container.resolve(web3Provider.option);
        return provider;
    }



}

export default FactoryWeb3Interaction;