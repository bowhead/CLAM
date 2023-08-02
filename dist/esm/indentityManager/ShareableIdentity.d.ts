import IdentityManager from './IdentityManager';
/**
 * This class allows you to create N identities based on a main identity,
 * thus generating compatible and child identities based on the main identity.
 */
declare class ShareableIdentity {
    mainIdentity: IdentityManager;
    identities: IdentityManager[];
    lastIdentity: number;
    /**
     * Constructor that initializes your ShareableIdentity component
     * using the values passed as parameters.
     *
     * @param {IdentityManager} mainIdentity This parameter is the main identity for instantiating many identities.
     */
    constructor(mainIdentity: IdentityManager);
    /**
     * This function generates N identities based on the main identity.
     *
     * @param {number} count this parameter is the number of identities that will be
     * instantiated from the main identity.
     */
    generateIdentities: (count: number) => Promise<void>;
    /**
     * This function returns a specific identity.
     *
     * @param {number} index This parameter is the specific position in your identities.
     * @returns {IdentityManager} an instance of IdentityManager class.
     */
    getIdentityByIndex: (index: number) => IdentityManager;
}
export default ShareableIdentity;
