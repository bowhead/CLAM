/**
 * This interface represents the implementation for 
 * encrypting and decrypting data using different encryption and decryption algorithms.
 */
interface IEncryptionLayer {
    /**
     * This function encrypts the data passed as a parameter using the 
     * key passed as a parameter.
     * 
     * @param key This parameter is the key to encrypt the data.
     * @param data This parameter is the data that will be encrypted.
     */
    ecryptData(key: string, data: string): Promise<string>;

    /**
     * This function decrypt the data passed as a parameter using the
     * key passed as a parameter.
     * 
     * @param key This parameter is the key to decrypt the data.
     * @param data This parameter is the encrypted data that will be decrypted.
     */
    decryptData(key: string, data: string): Promise<string>;
}

export default IEncryptionLayer;