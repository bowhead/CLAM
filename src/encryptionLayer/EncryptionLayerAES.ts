import IEncryptionLayer from './IEncryptionLayer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import CryptoES from 'crypto-es';
//eslint-disable-next-line @typescript-eslint/no-unused-vars
import { injectable } from 'tsyringe';
/**
 * This class is the implementation of EncryptionLayer using the AES algorithm.
 */
@injectable()
class EncryptionLayerAES implements IEncryptionLayer {

    private keySize = 256;
    private iterations = 100;

    /**
     * This function encrypts the data passed as a parameter 
     * using the key passed as a parameter with the AES-25 algorithm.
     * 
     * @param {string} key This parameter is the key with which the information will be encrypted.
     * @param {string} data This parameter is the information to be encrypted.
     * @returns {string} returns a string promise, when resolved it returns a string representing the encrypted data.
     */
    encryptData(key: string, data: string): Promise<string> {

        if (key.trim().length === 0 || key.trim().length < 3) throw new Error('Error, the length of the key to encrypt the data must be greater than 5');
        if (data.trim().length === 0) throw new Error('The data must have at least one character');

        const salt = CryptoES.lib.WordArray.random(128 / 8);
        const keyEncrypt = CryptoES.PBKDF2(key, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations,
        });
        const iv = CryptoES.lib.WordArray.random(128 / 8);
        const encrypted = CryptoES.AES.encrypt(data, keyEncrypt, {
            iv: iv,
            padding: CryptoES.pad.Pkcs7,
            mode: CryptoES.mode.CBC,
        });
        const transitMessage = salt.toString() + iv.toString() + encrypted.toString();
        return Promise.resolve(transitMessage);
    }
    /**
     * This function decrypt the data passed as a parameter
     * using the key passed as a parameter.
     * 
     * @param {string} key This parameter is the key which the information will be decrypted.
     * @param {string} data This parameter is the data encrypted to be decrypted.
     * @returns {string} return a string promise, when resolve it returns a string representing the decrypted data.
     */
    decryptData(key: string, data: string): Promise<string> {
        if (key.trim().length === 0 || key.trim().length < 3) throw new Error('Error, the length of the key to decrypt the data must be greater than 5');
        if (data.trim().length === 0) throw new Error('The data must have at least one character');

        const salt = CryptoES.enc.Hex.parse(data.substr(0, 32));
        const iv = CryptoES.enc.Hex.parse(data.substr(32, 32));

        const encrypted = data.substring(64);
        const keyEncrypt = CryptoES.PBKDF2(key, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations,
        });
        const decrypted = CryptoES.AES.decrypt(encrypted, keyEncrypt, {
            iv: iv,
            padding: CryptoES.pad.Pkcs7,
            mode: CryptoES.mode.CBC,
        });
        return Promise.resolve(decrypted.toString(CryptoES.enc.Utf8));
    }

}

export default EncryptionLayerAES;