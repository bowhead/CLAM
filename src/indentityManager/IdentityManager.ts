/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

import { IEncryptionLayer } from '../encryptionLayer';
import { IKeysGenerator } from '../keysGenerator';
const { fromMnemonic } = require('ethereum-hdwallet');
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
     * This function re-establish a identity bassed in yhe mnemonic.
     * 
     * @param {string} mnemonic This parameter are the 12 word. 
     */
    public reestablishIdentity = async(mnemonic: string): Promise<void>=>{
        if(mnemonic.trim().length===0) throw new Error('Invalid mnemonic');
        const wallet = fromMnemonic(mnemonic);
        this.mnemonic = mnemonic;
        this.address = `0x${wallet.derive('m/44\'/60\'/0\'/0/0').getAddress().toString('hex')}`;
        this.privateKey = wallet.derive('m/44\'/60\'/0\'/0/0').getPrivateKey(true).toString('hex');
        this.publicKey = wallet.derive('m/44\'/60\'/0\'/0/0').getPublicKey(true).toString('hex');
        
        const data = {
            name: this.address,
            email: `${this.address}@localhost.com`
        };
        const { privateKey, publicKey } = await this.keysGenerator.generateKeys(data);
        this.privateKeySpecial = privateKey;
        this.publicKeySpecial = publicKey;
    }


    /**
     * This function generates your mnemonic, address, private key and public key to build your identity.
     * 
     */
    public generateIdentity = async (): Promise<void> => {
        if (this.mnemonic.trim() === '' && this.address.trim() === '' &&
            this.privateKey.trim() === '' && this.publicKey.trim() == '') {
            this.mnemonic = generateMnemonic();
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
    }

}

export default IdentityManager;
