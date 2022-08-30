import { IEncryptionLayer } from '../encryptionLayer';
import { IKeysGenerator } from '../keysGenerator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromMnemonic } = require('ethereum-hdwallet');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateMnemonic } = require('eth-hd-wallet');
import { injectable, inject } from 'tsyringe';

/**
 * This class is to create your mnemonic, address, public key and private key to build your identity, 
 * it also provides you with the functionality to create your PGP keys using the implementation of 
 * the IEncryptionLayer interface to generate your PGP keys, with these keys you will be able to 
 * encrypt and decrypt information.
 */
@injectable()
class IdentityManager {
    public mnemonic: string;
    public address: string;
    public privateKey: string;
    public publicKey: string;
    public privateKeySpecial: string;
    public publicKeySpecial: string;
    public encryptionLayer: IEncryptionLayer;
    public keysGenerator: IKeysGenerator;

    /**
     * This constructor initializes the class instance with the values passed as parameters.
     * 
     * @param  {IEncryptionLayer} encryptionLayer this parameter is the EncryptionLayer implementation.
     * @param {IKeysGenerator} keysGenerator this is parameter is the KeysGenerator implementation.
     */
    public constructor(
        @inject('EncryptionLayer') encryptionLayer: IEncryptionLayer,
        @inject('KeysGenerator') keysGenerator: IKeysGenerator) {
        this.mnemonic = '';
        this.address = '';
        this.privateKey = '';
        this.publicKey = '';
        this.privateKeySpecial = '';
        this.publicKeySpecial = '';
        this.encryptionLayer = encryptionLayer;
        this.keysGenerator = keysGenerator;
    }

    /**
     * This function generates an identity based on the mnemonic passed as parameters, in case of not passing 
     * the mnemonic a new identity will be created based on a totally new mnemonic.
     * 
     * @param {string} mnemonic This parameter is the 12 words that will be used to generate the identity information. 
     */
    public generateIdentity = async (mnemonic = ''): Promise<void> => {
        if (this.mnemonic.trim() === '' && this.address.trim() === '' &&
            this.privateKey.trim() === '' && this.publicKey.trim() == '') {
            this.mnemonic = mnemonic.trim() === '' ? generateMnemonic() : mnemonic;
            const hdwallet = fromMnemonic(this.mnemonic);
            this.address = `0x${hdwallet.derive('m/44\'/60\'/0\'/0/0').getAddress().toString('hex')}`;
            this.privateKey = hdwallet.derive('m/44\'/60\'/0\'/0/0').getPrivateKey(true).toString('hex');
            this.publicKey = hdwallet.derive('m/44\'/60\'/0\'/0/0').getPublicKey(true).toString('hex');
        }
        const data = {
            name: this.address,
            email: `${this.address}@localhost.com`
        };
        if (!this.keysGenerator) throw new Error('Please set a specific implementation of keysGenerator');
        const { privateKey, publicKey } = await this.keysGenerator.generateKeys(data);
        this.privateKeySpecial = privateKey;
        this.publicKeySpecial = publicKey;
    };

}

export default IdentityManager;
