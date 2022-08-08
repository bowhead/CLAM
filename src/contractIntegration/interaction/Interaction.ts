import { injectable, inject } from "tsyringe";
import {
    IConsentInteraction,
    IAccessInteraction,
} from "../";
import { IdentityManager } from "../../";
@injectable()
class Interaction {

    public acccessInteraction: IAccessInteraction;
    public consentInteraction: IConsentInteraction;
    public urlProvider: string;
    public identity: IdentityManager;

    public constructor(
        @inject("ConsentInteraction") consentInteraction: IConsentInteraction,
        @inject("AccessInteraction") acccessInteraction: IAccessInteraction
    ) {
        this.acccessInteraction = acccessInteraction;
        this.consentInteraction = consentInteraction;
    }
    public setUrlProvider(urlProvider: string): void {
        this.urlProvider = urlProvider;
    }
    public setIdentity(identity: IdentityManager): void {
        this.identity = identity;
    }

}


export default Interaction;