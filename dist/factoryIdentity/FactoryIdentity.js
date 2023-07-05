"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const encryptionLayer_1 = require("../encryptionLayer");
const keysGenerator_1 = require("../keysGenerator");
const indentityManager_1 = require("../indentityManager");
/**
 * This class is used to generate identities based on the EncryptionLayer
 * and KeysGenerator implementations making use of inject containers.
 */
class FactoryIdentity {
    /**
     * Constructor that initializes the class instance, setting two options for
     * EncryptionLayer (AES, PGP) and one option for KeysGenerator (PGP).
     */
    constructor() {
        this.optionsEncryptionLayer = [
            { name: 'AES', option: encryptionLayer_1.EncryptionLayerAES },
            { name: 'PGP', option: encryptionLayer_1.EncryptionLayerPGP },
        ];
        this.optionsKeysGenerator = [
            { name: 'PGP', option: keysGenerator_1.KeysGeneratorPGP }
        ];
    }
    /**
     * This function sets a new implementation for EncryptionLayer.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionEncryption(option) {
        const optionEncryptionExist = this.optionsEncryptionLayer.find(optionAux => optionAux.name === option.name);
        if (optionEncryptionExist)
            throw new Error('This option already exists.');
        this.optionsEncryptionLayer.push(option);
    }
    /**
     * Set options to generate keys
     * @param {IOption} option - This parameter contains the name and class of the new implementation.
     */
    setOptionKeysGenerator(option) {
        const optionKeysGenerator = this.optionsKeysGenerator.find(optionAux => optionAux.name === option.name);
        if (optionKeysGenerator) {
            throw new Error('This option already exists.');
        }
        this.optionsKeysGenerator.push(option);
    }
    /**
     * This function generates a new identity with past implementations as parameters.
     *
     * @param {string} encryptionLayerType This parameter is the option of EncryptionLayer implementation.
     * @param {string} generatorKeysType This parameter is the option of KeysGenerator implementation.
     * @returns {IdentityManager} return a new instance of IdentityManager.
     */
    generateIdentity(encryptionLayerType, generatorKeysType) {
        const encryptionLayer = this.optionsEncryptionLayer.find(option => option.name.toLowerCase() === encryptionLayerType.toLowerCase());
        const keysGenerator = this.optionsKeysGenerator.find(option => option.name.toLowerCase() === generatorKeysType.toLowerCase());
        if (!encryptionLayer)
            throw new Error('The encryptionLayer type doesn\'t exist');
        if (!keysGenerator)
            throw new Error('The keysGenerator type doesn\'t exist');
        tsyringe_1.container.register('EncryptionLayer', encryptionLayer.option);
        tsyringe_1.container.register('KeysGenerator', keysGenerator.option);
        const identity = tsyringe_1.container.resolve(indentityManager_1.IdentityManager);
        return identity;
    }
}
exports.default = FactoryIdentity;
//# sourceMappingURL=FactoryIdentity.js.map