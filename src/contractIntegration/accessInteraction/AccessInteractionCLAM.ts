import { injectable } from "tsyringe";
import {IAccessInteraction} from "./";
@injectable()
class AccessInteractionCLAM implements IAccessInteraction{
    giveAccess(resource: string, consentId: string, account: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    revokeAccess(resource: string, consentId: string, account: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    checkAccess(resource: string, consentId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getResourceByConsent(consentId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}


export default AccessInteractionCLAM;