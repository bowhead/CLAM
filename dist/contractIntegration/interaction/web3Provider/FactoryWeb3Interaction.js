"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const Web3Provider_1 = tslib_1.__importDefault(require("./Web3Provider"));
const Web3ProviderBowhead_1 = tslib_1.__importDefault(require("./Web3ProviderBowhead"));
/**
 * This class is used to create Web3Interactions
 */
class FactoryWeb3Interaction {
    /**
     * Constructor that initializes the instance of the class
     * by setting the 2 providers of the library
     */
    constructor() {
        this.web3Providers = [
            { name: 'web3', option: Web3Provider_1.default },
            { name: 'bowhead', option: Web3ProviderBowhead_1.default }
        ];
    }
    ;
    /**
     * This method return a instance of FactoryWeb3Interaction
     * @returns {FactoryWeb3Interaction} instance of this clase.
     */
    static getInstance() {
        if (!FactoryWeb3Interaction.instance) {
            this.instance = new FactoryWeb3Interaction();
        }
        return this.instance;
    }
    /**
     * This method set a new configuration to use in the interactions object.
     * @param {IInteractionConfig} config new configuration.
     */
    setConfig(config) {
        this.config = config;
    }
    /**
     * This method add a new Web3Provider implementation
     * @param {IOption} option implementation options
     */
    setOptionWeb3Provider(option) {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionWeb3Provider = this.web3Providers.find(optionAux => optionAux.name === option.name);
        if (optionWeb3Provider) {
            this.web3Providers.map(optionAux => optionAux.name === optionWeb3Provider.name ? optionWeb3Provider : optionAux);
        }
        else {
            this.web3Providers.push(option);
        }
    }
    /**
     * This method generate the a type of interaction with the parameter passed as a parameter..
     * @param {string} providerType Type of provider.
     * @returns {IWeb3Provider} a new Web3Provider implementation
     */
    generateWeb3Provider(providerType) {
        if (providerType.trim().length === 0 || providerType.trim() === '') {
            throw new Error('The name must have at least one character');
        }
        const web3Provider = this.web3Providers.find(option => option.name.trim().toLowerCase() === providerType.trim().toLowerCase());
        if (!web3Provider)
            throw new Error('The web3 provider type doesn\'t exist');
        tsyringe_1.container.register('Provider', { useValue: this.config.provider });
        tsyringe_1.container.register('Config', { useValue: this.config });
        const provider = tsyringe_1.container.resolve(web3Provider.option);
        return provider;
    }
}
exports.default = FactoryWeb3Interaction;
//# sourceMappingURL=FactoryWeb3Interaction.js.map