import IPGPKeys from "./IPGPKeys";

/**
 * This interface represents the implementation for generating 
 * the private and public keys using PGP (Pretty Good Privacy) 
 * and the encryptData and decryptData methods using the public 
 * and private keys.
 */
interface IEncryptionLayer {

    /**
     * This function generates the public and private pgp keys.
     * 
     * @param name This parameter is the name of the user that will generate the public and private pgp keys.
     * @param email This parameter is the email of the user that will generate the public and private pgp keys.
     */
    generatePGPKeys(name: string, email: string): Promise<IPGPKeys>;

    /**
     * This function encrypts the data passed as a parameter using the 
     * public key passed as a parameter.
     * 
     * @param publicKeyPGP This parameter is the public key to encrypt the data.
     * @param data This parameter is the data that will be encrypted.
     */
    ecryptData(publicKeyPGP: string, data: any): Promise<string>;

    /**
     * This function decrypt the data passed as a parameter using the
     * private key passed as a parameter.
     * 
     * @param privateKeyPGP This parameter is the private key to decrypt the data.
     * @param dataEncrypted This parameter is the encrypted data that will be decrypted.
     */
    decryptData(privateKeyPGP: any, dataEncrypted: any): Promise<string>;
}

export default IEncryptionLayer;