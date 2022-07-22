import IEncryptionLayer from "../interfaces/IEncryptionLayer";
const CryptoJS = require("crypto-js");

class EncryptioLayerAES implements IEncryptionLayer {

    private keySize: number = 256;
    private iterations: number = 100;

    ecryptData(key: string, data: any): Promise<string> {
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
        return transitmessage;
    }
    decryptData(key: any, data: any): Promise<string> {
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