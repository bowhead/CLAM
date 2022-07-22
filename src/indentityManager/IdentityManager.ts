import EncryptionLayer from "../encryptionLayer/EncryptioLayerPGP";
import IEncryptionLayer from "../interfaces/IEncryptionLayer";
import IKeysGenerator from "../interfaces/IKeysGenerator";
import KeysGeneratorPGP from "../encryptionLayer/KeysGeneratorPGP";
const { fromMnemonic } = require('ethereum-hdwallet');
const { generateMnemonic } = require('eth-hd-wallet');

/**
 * This class is to create your mnemonic, address, public key and private key to build your identity, 
 * it also provides you with the functionality to create your PGP keys using the implementation of 
 * the IEncryptionLayer interface to generate your PGP keys, with these keys you will be able to 
 * encrypt and decrypt information.
 */
class IdentityManager {
    mnemonic: string;
    address: string;
    privateKey: string;
    publicKey: string;
    privateKeyPGP: any;
    publicKeyPGP: any;
    encryptionLayer: IEncryptionLayer;
    keysGenerator: IKeysGenerator;

    /**
     * Constructor that initializes your identity using the values passed as parameters.
     * 
     * @param mnemonic this parameter is your 12 words to check your identity.
     * @param address this parameter is the address of your identity.
     * @param privateKey this parameter is your private key.
     * @param publicKey this parameter is your public key.
     */
    constructor(mnemonic: string = "", address: string = "", privateKey: string = "", publicKey: string = "") {
        this.mnemonic = mnemonic;
        this.address = address;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.privateKeyPGP = "";
        this.publicKeyPGP = "";
        this.encryptionLayer = new EncryptionLayer();
        this.keysGenerator = new KeysGeneratorPGP();
    }

    /**
     * This function generates your mnemonic, address, private key and public key to build your identity.
     * 
     */
    generateIdentity = async (): Promise<void> => {

        if (this.mnemonic.trim() === "" && this.address.trim() === "" &&
            this.privateKey.trim() === "" && this.publicKey.trim() == "") {
            this.mnemonic = generateMnemonic();
            const hdwallet: any = fromMnemonic(this.mnemonic);
            this.address = `0x${hdwallet.derive(`m/44'/60'/0'/0/0`).getAddress().toString('hex')}`;
            this.privateKey = hdwallet.derive(`m/44'/60'/0'/0/0`).getPrivateKey(true).toString('hex');
            this.publicKey = hdwallet.derive(`m/44'/60'/0'/0/0`).getPublicKey(true).toString('hex');

        }

        const data = {
            name: this.address,
            email: `${this.address}@localhost.com`
        }
        const { privateKeyPGP, publicKeyPGP } = await this.keysGenerator.generateKeys(data);
        this.privateKeyPGP = privateKeyPGP;
        this.publicKeyPGP = publicKeyPGP;
    }

}

export default IdentityManager;
