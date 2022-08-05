import { injectable } from "tsyringe";
import {IConsentInteraction} from "./";

@injectable()
class ConsentInteractionCLAM implements IConsentInteraction {
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
    
    

}

export default ConsentInteractionCLAM;