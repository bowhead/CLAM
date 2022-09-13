import IdentityManager from './IdentityManager';
import FactoryIdentity from '../factoryIdentity/FactoryIdentity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromMnemonic } = require('ethereum-hdwallet');

/**
 * This class allows you to create N identities based on a main identity, 
 * thus generating compatible and child identities based on the main identity.
 */
class ShareableIdentity {
    public mainIdentity: IdentityManager;
    public identities: IdentityManager[];
    public lastIdentity: number;

    /**
     * Constructor that initializes your ShareableIdentity component
     * using the values passed as parameters.
     * 
     * @param {IdentityManager} mainIdentity This parameter is the main identity for instantiating many identities.
     */
    public constructor(mainIdentity: IdentityManager) {
        this.mainIdentity = mainIdentity;
        this.identities = [];
        this.lastIdentity = 1;
    }

    /**
     * This function generates N identities based on the main identity.
     * 
     * @param {number} count this parameter is the number of identities that will be 
     * instantiated from the main identity.
     */
    public generateIdentities = async (count: number): Promise<void> => {
        if (count === 0 || count < 1) throw new Error('The count must be greater than 0');
        if (this.mainIdentity.mnemonic.length != 0) {
            const auxWallet = fromMnemonic(this.mainIdentity.mnemonic);
            let address = '';
            let privateKey = '';
            let publicKey = '';
            for (let i: number = this.lastIdentity; i <= count; i++) {
                address = `0x${auxWallet.derive(`m/44'/60'/0'/0/${i}`).getAddress().toString('hex')}`;
                privateKey = auxWallet.derive(`m/44'/60'/0'/0/${i}`).getPrivateKey(true).toString('hex');
                publicKey = auxWallet.derive(`m/44'/60'/0'/0/${i}`).getPublicKey(true).toString('hex');

                //Setting info
                const newIdentityChild: IdentityManager = new IdentityManager(this.mainIdentity.encryptionLayer, this.mainIdentity.keysGenerator);
                newIdentityChild.mnemonic = this.mainIdentity.mnemonic;
                newIdentityChild.address = address;
                newIdentityChild.privateKey = privateKey;
                newIdentityChild.publicKey = publicKey;
                await newIdentityChild.generateIdentity();
                this.identities.push(newIdentityChild);
                this.lastIdentity++;
            }
        } else {
            throw new Error('The main identity has to be initialized');
        }

    };

    /**
     * This function returns a specific identity.
     * 
     * @param {number} index This parameter is the specific position in your identities.
     * @returns {IdentityManager} an instance of IdentityManager class.
     */
    public getIdentityByIndex = (index: number): IdentityManager => {
        if (index < 0) throw new Error('Position must be equal or greater than 0');
        const factoryIdentity: FactoryIdentity = new FactoryIdentity();
        let identity: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        if (index >= 0 && index < this.identities.length) {
            identity = this.identities[index];
            this.identities[index];
        }
        return identity;
    };
}

export default ShareableIdentity;