import IEncryptionLayer from "./IEncryptionLayer";
import { readKey, encrypt, decrypt, readMessage, createMessage, decryptKey, readPrivateKey } from 'openpgp';

class EncryptionLayerPGP implements IEncryptionLayer {
    /**
     * This function encrypts the data passed as a parameter using the 
     * public key passed as a parameter.
     * 
     * @param publicKeyPGP This parameter is the public key to encrypt the data.
     * @param data This parameter is the data that will be encrypted.
     */
    ecryptData = async (publicKeyPGP: string, data: string): Promise<string> => {
        const publicKey = await readKey({ armoredKey: publicKeyPGP });
        const encrypted = await encrypt({
            message: await createMessage({ text: data }),
            encryptionKeys: publicKey,
        });
        return encrypted.toString();
    }

    /**
     * This function decrypt the data passed as a parameter using the
     * private key passed as a parameter.
     * 
     * @param privateKeyPGP This parameter is the private key to decrypt the data.
     * @param dataEncrypted This parameter is the encrypted data that will be decrypted.
     */
    decryptData = async (privateKeyPGP: string, dataEncrypted: string): Promise<string> => {
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
    }
};

export default EncryptionLayerPGP;