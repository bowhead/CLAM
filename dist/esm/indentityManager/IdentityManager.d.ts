import { IEncryptionLayer } from '../encryptionLayer';
import { IKeysGenerator } from '../keysGenerator';
/**
 * This class is to create your mnemonic, address, public key and private key to build your identity,
 * it also provides you with the functionality to create your PGP keys using the implementation of
 * the IEncryptionLayer interface to generate your PGP keys, with these keys you will be able to
 * encrypt and decrypt information.
 */
declare class IdentityManager {
    mnemonic: string;
    address: string;
    privateKey: string;
    publicKey: string;
    privateKeySpecial: string;
    publicKeySpecial: string;
    encryptionLayer: IEncryptionLayer;
    keysGenerator: IKeysGenerator;
    /**
     * This constructor initializes the class instance with the values passed as parameters.
     *
     * @param  {IEncryptionLayer} encryptionLayer this parameter is the EncryptionLayer implementation.
     * @param {IKeysGenerator} keysGenerator this is parameter is the KeysGenerator implementation.
     */
    constructor(encryptionLayer: IEncryptionLayer, keysGenerator: IKeysGenerator);
    /**
     * This function generates an identity based on the mnemonic passed as parameters, in case of not passing
     * the mnemonic a new identity will be created based on a totally new mnemonic.
     *
     * @param {string} mnemonic This parameter is the 12 words that will be used to generate the identity information.
     */
    generateIdentity: (mnemonic?: string) => Promise<void>;
}
export default IdentityManager;
