import { IEncryptionLayer } from '.';
import { readKey, encrypt, decrypt, readMessage, createMessage, decryptKey, readPrivateKey } from 'openpgp';
//eslint-disable-next-line @typescript-eslint/no-unused-vars
import { injectable } from 'tsyringe';
/**
 * This class is the implementation of EncryptionLayer using the PGP algorithm.
 */
@injectable()
class EncryptionLayerPGP implements IEncryptionLayer {
    /**
     * This function encrypts the data passed as a parameter using the 
     * public key passed as a parameter.
     * 
     * @param {string} publicKeyPGP This parameter is the public key to encrypt the data.
     * @param {string} data This parameter is the data that will be encrypted.
     * @returns {string} returns a string promise, when resolved it returns a string representing the encrypted data.
     */
    encryptData = async (publicKeyPGP: string, data: string): Promise<string> => {

        if (data.trim().length == 0) throw new Error('The data must have at least one character');
        const pubKeys = publicKeyPGP.split(',');
        const publicKeys = pubKeys.map(async (key) => {
            return (await readKey({ armoredKey: key }));
        });
        
        const encrypted = await encrypt({
            message: await createMessage({ text: data }),
            encryptionKeys: await Promise.all(publicKeys),
        });
        return encrypted.toString();
    };

    /**
     * This function decrypt the data passed as a parameter using the
     * private key passed as a parameter.
     * 
     * @param {string} privateKeyPGP This parameter is the private key to decrypt the data.
     * @param {string} dataEncrypted This parameter is the encrypted data that will be decrypted.
     * @returns {string} return a string promise, when resolve it returns a string representing the decrypted data.
     */
    decryptData = async (privateKeyPGP: string, dataEncrypted: string): Promise<string> => {
        if (dataEncrypted.trim().length == 0) throw new Error('The data must have at least one character');
        
        const privateKeysArr = privateKeyPGP.split(',');
        const privateKeys = privateKeysArr.map(async (key) => {
            return await decryptKey({
                privateKey: await readPrivateKey({ armoredKey: key}),
                passphrase: 'passphrase'
            });
        });

        const message = await readMessage({
            armoredMessage: dataEncrypted
        });
        const { data: decrypted } = await decrypt({
            message,
            decryptionKeys: await Promise.all(privateKeys)
        });
        return decrypted.toString();
    };
}

export default EncryptionLayerPGP;