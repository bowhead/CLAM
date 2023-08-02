import IEncryptionLayer from './IEncryptionLayer';
/**
 * This class is the implementation of EncryptionLayer using the AES algorithm.
 */
declare class EncryptionLayerAES implements IEncryptionLayer {
    private keySize;
    private iterations;
    /**
     * This function encrypts the data passed as a parameter
     * using the key passed as a parameter with the AES-25 algorithm.
     *
     * @param {string} key This parameter is the key with which the information will be encrypted.
     * @param {string} data This parameter is the information to be encrypted.
     * @returns {string} returns a string promise, when resolved it returns a string representing the encrypted data.
     */
    encryptData(key: string, data: string): Promise<string>;
    /**
     * This function decrypt the data passed as a parameter
     * using the key passed as a parameter.
     *
     * @param {string} key This parameter is the key which the information will be decrypted.
     * @param {string} data This parameter is the data encrypted to be decrypted.
     * @returns {string} return a string promise, when resolve it returns a string representing the decrypted data.
     */
    decryptData(key: string, data: string): Promise<string>;
}
export default EncryptionLayerAES;
