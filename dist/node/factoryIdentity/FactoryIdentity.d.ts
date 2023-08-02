import 'reflect-metadata';
import IOption from './IOption';
import { IdentityManager } from '../indentityManager';
/**
 * This class is used to generate identities based on the EncryptionLayer
 * and KeysGenerator implementations making use of inject containers.
 */
declare class FactoryIdentity {
    private optionsEncryptionLayer;
    private optionsKeysGenerator;
    /**
     * Constructor that initializes the class instance, setting two options for
     * EncryptionLayer (AES, PGP) and one option for KeysGenerator (PGP).
     */
    constructor();
    /**
     * This function sets a new implementation for EncryptionLayer.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionEncryption(option: IOption): void;
    /**
     * Set options to generate keys
     * @param {IOption} option - This parameter contains the name and class of the new implementation.
     */
    setOptionKeysGenerator(option: IOption): void;
    /**
     * This function generates a new identity with past implementations as parameters.
     *
     * @param {string} encryptionLayerType This parameter is the option of EncryptionLayer implementation.
     * @param {string} generatorKeysType This parameter is the option of KeysGenerator implementation.
     * @returns {IdentityManager} return a new instance of IdentityManager.
     */
    generateIdentity(encryptionLayerType: string, generatorKeysType: string): IdentityManager;
}
export default FactoryIdentity;
