import { injectable, inject } from 'tsyringe';
import {
    IConsentInteraction,
    IAccessInteraction,
} from '../';
import { IdentityManager } from '../../';

/**
 * This class is used to interact with the blockchain by making use 
 * of consent and access interaction instances.
 */

@injectable()
class Interaction {

    public acccessInteraction: IAccessInteraction;
    public consentInteraction: IConsentInteraction;
    public urlProvider: string;
    public identity: IdentityManager;

    /**
     * This constructor initializes the intent by injecting a specific 
     * implementation of consent and access.
     * 
     * @param {IConsentInteraction} consentInteraction This parameter is the implementation of ConsentInteraction.
     * @param {IAccessInteraction} acccessInteraction This parameter is the implementation of AccessInteration.
     */
    public constructor(
        @inject('ConsentInteraction') consentInteraction: IConsentInteraction,
        @inject('AccessInteraction') acccessInteraction: IAccessInteraction

    ) {
        this.acccessInteraction = acccessInteraction;
        this.consentInteraction = consentInteraction;
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