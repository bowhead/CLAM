import { injectable, inject } from "tsyringe";
import {
    IConsentInteraction,
    IAccessInteraction,
} from "../";
import { IdentityManager } from "../../";

@injectable()
class Interaction implements IConsentInteraction, IAccessInteraction {

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
    getResourceByConsent(consentId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    saveConsent(consentId: string, status: boolean): Promise<any> {
        throw new Error("Method not implemented.");
    }
    cancelConsent(consentId: string, status: boolean): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getConsentById(consentId: string, owner: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    addKey(consentId: string, addressConsent: string, key: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getKeys(consentId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    giveAccess(resource: string, consentId: string, account: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    revokeAccess(resource: string, consentId: string, account: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    checkAccess(resource: string, consentId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }


}


export default Interaction;