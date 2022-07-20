import IdentityManager from "./IdentityManager";
const { fromMnemonic } = require('ethereum-hdwallet');

/**
 * This class allows you to create N indentities based on a main indentity, 
 * thus generating compatible and child indentities based on the main indentity.
 */
class ShareableIdentity {
    mainIdentity: IdentityManager;
    identities: IdentityManager[];
    lastIdentity: number;

    /**
     * Constructor that initializes your ShareableIdentity component
     * using the values passed as parameters.
     * 
     * @param mainIdentity This parameter is the main identity for instantiating many identities.
     */
    constructor(mainIdentity: IdentityManager) {
        this.mainIdentity = mainIdentity;
        this.identities = [];
        this.lastIdentity = 1;
    }

    /**
     * This function generates N identities based on the main identity.
     * 
     * @param count this parameter is the number of identities that will be 
     * instantiated from the main identity.
     */
    generateIdentities = async (count: number): Promise<void> => {
        if (this.mainIdentity.mnemonic.length != 0) {
            const auxWallet = fromMnemonic(this.mainIdentity.mnemonic);
            let address: string = ""
            let privateKey: string = ""
            let publicKey: string = ""
            for (let i: number = this.lastIdentity; i <= count; i++) {
                address = `0x${auxWallet.derive(`m/44'/60'/0'/0/${i}`).getAddress().toString('hex')}`;
                privateKey = auxWallet.derive(`m/44'/60'/0'/0/${i}`).getPrivateKey(true).toString('hex');
                publicKey = auxWallet.derive(`m/44'/60'/0'/0/${i}`).getPublicKey(true).toString('hex');
                const newWalletChild: IdentityManager = new IdentityManager(this.mainIdentity.mnemonic, address, privateKey, publicKey);
                await newWalletChild.generateIdentity();
                this.identities.push(newWalletChild);
                this.lastIdentity++;
            }
        }

    }

    /**
     * This function returns a specific indetity.
     * 
     * @param index This parameter is the specific position in your identities.
     * @returns an instance of IdentityManeger class.
     */
    getIdentityByIndex = (index: number): IdentityManager => {
        let identity: IdentityManager = new IdentityManager();
        if (index >= 0 && index < this.identities.length) {
            identity = this.identities[index];
            this.identities[index];
        }
        return identity;
    }

}

export default ShareableIdentity;