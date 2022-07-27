import IEncryptionLayer from "./IEncryptionLayer";
const CryptoJS = require("crypto-js");

class EncryptioLayerAES implements IEncryptionLayer {

    private keySize: number = 256;
    private iterations: number = 100;

    /**
     * This function encrypts the data passed as a parameter 
     * using the key passed as a parameter with the AES-25 algorithm.
     * 
     * @param key This parameter is the key with which the information will be encrypted.
     * @param data This parameter is the information to be encrypted.
     * @returns returns a string promise, when resolved it returns a string representing the encrypted data.
     */
    ecryptData(key: string, data: string): Promise<string> {
        const salt = CryptoJS.lib.WordArray.random(128 / 8);
        const keyEncrypt = CryptoJS.PBKDF2(key, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations,
        });
        const iv = CryptoJS.lib.WordArray.random(128 / 8);
        const encrypted = CryptoJS.AES.encrypt(data, keyEncrypt, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        });
        const transitmessage = salt.toString() + iv.toString() + encrypted.toString();
        console.log(transitmessage);
        
        return transitmessage;
    }
    /**
     * This function decrypt the data passed as a perameter
     * using the key passed as a parameter.
     * 
     * @param key This parameter is the key which the information will be decrypted.
     * @param data This paramater is the data encrypted to be decrypted.
     * @returns return a string promise, when resolve it returns a string representing the decrypted data.
     */
    decryptData(key: any, data: string): Promise<string> {
        const salt = CryptoJS.enc.Hex.parse(data.substr(0, 32));
        const iv = CryptoJS.enc.Hex.parse(data.substr(32, 32));

        const encrypted = data.substring(64);
        const keyEncrypt = CryptoJS.PBKDF2(key, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations,
        });
        const decrypted = CryptoJS.AES.decrypt(encrypted, keyEncrypt, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

}

export default EncryptioLayerAES;