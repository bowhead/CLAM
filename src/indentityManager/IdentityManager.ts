import IEncryptionLayer from "../encryptionLayer/IEncryptionLayer";
import IKeysGenerator from "../keysGenerator/IKeysGenerator";
const { fromMnemonic } = require('ethereum-hdwallet');
const { generateMnemonic } = require('eth-hd-wallet');

/**
 * This class is to create your mnemonic, address, public key and private key to build your identity, 
 * it also provides you with the functionality to create your PGP keys using the implementation of 
 * the IEncryptionLayer interface to generate your PGP keys, with these keys you will be able to 
 * encrypt and decrypt information.
 */
class IdentityManager {
    public mnemonic: string;
    public address: string;
    public privateKey: string;
    public publicKey: string;
    public privateKeyPGP: any;
    public publicKeyPGP: any;
    public encryptionLayer: IEncryptionLayer;
    public keysGenerator: IKeysGenerator;

    /**
     * Constructor that initializes your identity using the values passed as parameters.
     * 
     * @param mnemonic this parameter is your 12 words to check your identity.
     * @param address this parameter is the address of your identity.
     * @param privateKey this parameter is your private key.
     * @param publicKey this parameter is your public key.
     */
    public constructor(mnemonic: string = "", address: string = "", privateKey: string = "", publicKey: string = "") {
        this.mnemonic = mnemonic;
        this.address = address;
        this.privateKey = privateKey;
        this.publicKey = publicKey;
        this.privateKeyPGP = "";
        this.publicKeyPGP = "";
    }

    /**
     * This function generates your mnemonic, address, private key and public key to build your identity.
     * 
     */
    public generateIdentity = async (): Promise<void> => {

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
        if (!this.keysGenerator) throw new Error("Please set a specific implementation of keysGenerator");
        const { privateKey, publicKey } = await this.keysGenerator.generateKeys(data);
        this.privateKeyPGP = privateKey;
        this.publicKeyPGP = publicKey;
    }

    /**
     * This function set the specific implementation of encryptionLayer interface.
     * 
     * @param encryptionLayer this parameter is the implementation of the encryptionLayer interface.
     */
    public setEncryptionLayer = (encryptionLayer: IEncryptionLayer): void => {
        this.encryptionLayer = encryptionLayer;
    }

    /**
     * This function set the specific implementation of keysGenerator interface.
     * 
     * @param keysGenerator this parameter is the implementation of the keysGenerator interface.
     */
    public setKeysGenerator = (keysGenerator: IKeysGenerator): void => {
        this.keysGenerator = keysGenerator;
    }
}

export default IdentityManager;
