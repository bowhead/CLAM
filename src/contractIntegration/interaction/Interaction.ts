//eslint-disable-next-line
import { injectable, inject } from 'tsyringe';
import {
    IConsentInteraction,
    IAccessInteraction,
    IIPFSManagementInteraction
} from '../';
import { IdentityManager } from '../../';

/**
 * This class is used to interact with the block-chain by making use 
 * of consent and access interaction instances.
 */
@injectable()
class Interaction {

    public accessInteraction: IAccessInteraction;
    public consentInteraction: IConsentInteraction;
    public IPFSManagementInteraction: IIPFSManagementInteraction;
    public urlProvider: string;
    public identity: IdentityManager;

    /**
     * This constructor initializes the intent by injecting a specific 
     * implementation of consent, access and IPFS management.
     * 
     * @param {IConsentInteraction} consentInteraction This parameter is the implementation of ConsentInteraction.
     * @param {IAccessInteraction} accessInteraction This parameter is the implementation of AccessInteraction.
     * @param {IIPFSManagementInteraction} IPFSManagementInteraction This parameter is the implementation of IPFSManagementInteraction.
     */
    public constructor(
        @inject('ConsentInteraction') consentInteraction: IConsentInteraction,
        @inject('AccessInteraction') accessInteraction: IAccessInteraction,
        @inject('IPFSManagementInteraction') IPFSManagementInteraction: IIPFSManagementInteraction
    ) {
        this.accessInteraction = accessInteraction;
        this.consentInteraction = consentInteraction;
        this.IPFSManagementInteraction = IPFSManagementInteraction;
    }
    /**
     * This function set a new URL provider of web 3
     * 
     * @param {string} urlProvider This parameter is the url provider.
     */
    public setUrlProvider(urlProvider: string): void {
        this.urlProvider = urlProvider;
    }

    /**
     * This function establishes a new identity to 
     * perform the operations with the web 3
     * 
     * @param {IdentityManager} identity This parameter is the identity that will be used to interact with the web.
     */
    public setIdentity(identity: IdentityManager): void {
        this.identity = identity;
    }

}


export default Interaction;