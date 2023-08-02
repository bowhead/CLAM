import { IEncryptionLayer } from '.';
/**
 * This class is the implementation of EncryptionLayer using the PGP algorithm.
 */
declare class EncryptionLayerPGP implements IEncryptionLayer {
    /**
     * This function encrypts the data passed as a parameter using the
     * public key passed as a parameter.
     *
     * @param {string} publicKeyPGP This parameter is the public key to encrypt the data.
     * @param {string} data This parameter is the data that will be encrypted.
     * @returns {string} returns a string promise, when resolved it returns a string representing the encrypted data.
     */
    encryptData: (publicKeyPGP: string, data: string) => Promise<string>;
    /**
     * This function decrypt the data passed as a parameter using the
     * private key passed as a parameter.
     *
     * @param {string} privateKeyPGP This parameter is the private key to decrypt the data.
     * @param {string} dataEncrypted This parameter is the encrypted data that will be decrypted.
     * @returns {string} return a string promise, when resolve it returns a string representing the decrypted data.
     */
    decryptData: (privateKeyPGP: string, dataEncrypted: string) => Promise<string>;
}
export default EncryptionLayerPGP;
