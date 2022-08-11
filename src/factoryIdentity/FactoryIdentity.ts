import 'reflect-metadata';
import { container } from 'tsyringe';
import IOption from './IOption';
import { EncryptioLayerAES, EncryptionLayerPGP } from '../encryptionLayer';
import { KeysGeneratorPGP } from '../keysGenerator';
import { IdentityManager } from '../indentityManager';

/**
 * This class is used to generate identities based on the EncryptionLayer 
 * and KeysGenerator implementations making use of inject containers.
 */
class FactoryIdentity {
    private optionsEncryptionLayer: IOption[];
    private optionsKeysGenerator: IOption[];

    /**
     * Constructor that initializes the class instance, setting two options for 
     * EncryptionLayer (aes, pgp) and one option for KeysGenerator (pgp).
     */
    constructor() {
        this.optionsEncryptionLayer = [
            { name: 'aes', option: EncryptioLayerAES },
            { name: 'pgp', option: EncryptionLayerPGP },
        ];
        this.optionsKeysGenerator = [
            { name: 'pgp', option: KeysGeneratorPGP }
        ];

    }
    /**
     * This function sets a new implementation for EncryptionLayer.
     * 
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionEncryption(option: IOption): void {
        const optionEncryptionExist = this.optionsEncryptionLayer.find(optionAux => optionAux.name === option.name);
        if (optionEncryptionExist) throw new Error('This option already exists.');

        this.optionsEncryptionLayer.push(option);
    }
    /**
     * This function sets a new implemnetation for KeysGenerator.
     * 
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionKeysGenerator(option: IOption): void {
        const optionKeysGenerator = this.optionsKeysGenerator.find(optionAux => optionAux.name === option.name);
        if (optionKeysGenerator) throw new Error('This option already exists.');

        this.optionsKeysGenerator.push(option);
    }
    /**
     * This function generates a new identity with past implementations as parameters.
     * 
     * @param {string} encryptionLayerType This parameter is the option of EncryptionLayer implementation.
     * @param {string} generatorKeysType This parameter is teh option of KeysGenerator implementation.
     * @returns {IdentityManager} return a new instance of IdentityManager.
     */
    generateIdentity(encryptionLayerType: string, generatorKeysType: string): IdentityManager {
        const encryptionLayer = this.optionsEncryptionLayer.find(option => option.name.toLowerCase() === encryptionLayerType.toLowerCase());
        const keysGenerator = this.optionsKeysGenerator.find(option => option.name.toLowerCase() === generatorKeysType.toLowerCase());
        if (!encryptionLayer) throw new Error('The encryptionLayer type doesn\'t exist');
        if (!keysGenerator) throw new Error('The keysGenerator type doesn\'t exist');

        container.register('EncryptionLayer', encryptionLayer.option);
        container.register('KeysGenerator', keysGenerator.option);
        const identity = container.resolve(IdentityManager);
        return identity;
    }

}

export default FactoryIdentity;