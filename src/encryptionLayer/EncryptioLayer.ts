import IEncryptionLayer from "../interfaces/IEncryptionLayer";
import { generateKey, readKey, encrypt, decrypt, readMessage, createMessage, decryptKey, readPrivateKey } from 'openpgp';
import IPGPKeys from "../interfaces/IPGPKeys";

/**
 * This class is used to generate public and private keys using PGP 
 * (pretty good privacy) as well as encrypt and decrypt data using 
 * the above mentioned standard together with public and private keys.
 */
class EncryptionLayer implements IEncryptionLayer {

    /**
     * This function generates the public and private pgp keys.
     * @param name This parameter is the name of the user that will generate the public and private pgp keys.
     * @param email This parameter is the email of the user that will generate the public and private pgp keys.
     */
    generatePGPKeys = async (name: string, email: string): Promise<IPGPKeys> => {
        try {
            const { privateKey, publicKey } = await generateKey({
                type: 'ecc',
                curve: 'curve25519',
                userIDs: [{ name, email }],
                passphrase: "passphrase",
                format: 'armored'
            });
            const pgpKeys: IPGPKeys = {
                privateKeyPGP: privateKey,
                publicKeyPGP: publicKey
            }
            return pgpKeys;
        } catch (error) {
            const pgpKeys: IPGPKeys = { privateKeyPGP: "", publicKeyPGP: "" }
            return pgpKeys;
        }
    }

    /**
     * This function encrypts the data passed as a parameter using the 
     * public key passed as a parameter.
     * 
     * @param publicKeyPGP This parameter is the public key to encrypt the data.
     * @param data This parameter is the data that will be encrypted.
     */
    ecryptData = async (publicKeyPGP: string, data: any): Promise<string> => {
        try {
            const publicKey = await readKey({ armoredKey: publicKeyPGP });
            const encrypted = await encrypt({
                message: await createMessage({ text: data }),
                encryptionKeys: publicKey,
            });
            return encrypted.toString();
        } catch (error) {
            return "Error while encrypting data";
        }
    }

    /**
     * This function decrypt the data passed as a parameter using the
     * private key passed as a parameter.
     * 
     * @param privateKeyPGP This parameter is the private key to decrypt the data.
     * @param dataEncrypted This parameter is the encrypted data that will be decrypted.
     */
    decryptData = async (privateKeyPGP: any, dataEncrypted: any): Promise<string> => {
        try {
            const privateKey = await decryptKey({
                privateKey: await readPrivateKey({ armoredKey: privateKeyPGP }),
                passphrase: "passphrase"
            });
            const message = await readMessage({
                armoredMessage: dataEncrypted
            });
            const { data: decrypted } = await decrypt({
                message,
                decryptionKeys: privateKey
            });
            return decrypted.toString();
        } catch (error) {
            return "Error while decrypting data";
        }
    }
};

export default EncryptionLayer;