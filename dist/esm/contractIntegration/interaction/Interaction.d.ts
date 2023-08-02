import { IConsentInteraction, IAccessInteraction, IIPFSManagementInteraction } from '../';
import { IdentityManager } from '../../';
/**
 * This class is used to interact with the block-chain by making use
 * of consent and access interaction instances.
 */
declare class Interaction {
    accessInteraction: IAccessInteraction;
    consentInteraction: IConsentInteraction;
    IPFSManagementInteraction: IIPFSManagementInteraction;
    urlProvider: string;
    identity: IdentityManager;
    /**
     * This constructor initializes the intent by injecting a specific
     * implementation of consent, access and IPFS management.
     *
     * @param {IConsentInteraction} consentInteraction This parameter is the implementation of ConsentInteraction.
     * @param {IAccessInteraction} accessInteraction This parameter is the implementation of AccessInteraction.
     * @param {IIPFSManagementInteraction} IPFSManagementInteraction This parameter is the implementation of IPFSManagementInteraction.
     */
    constructor(consentInteraction: IConsentInteraction, accessInteraction: IAccessInteraction, IPFSManagementInteraction: IIPFSManagementInteraction);
    /**
     * This function set a new URL provider of web 3
     *
     * @param {string} urlProvider This parameter is the url provider.
     */
    setUrlProvider(urlProvider: string): void;
    /**
     * This function establishes a new identity to
     * perform the operations with the web 3
     *
     * @param {IdentityManager} identity This parameter is the identity that will be used to interact with the web.
     */
    setIdentity(identity: IdentityManager): void;
}
export default Interaction;
