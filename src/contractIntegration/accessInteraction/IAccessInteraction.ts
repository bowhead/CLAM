import { IdentityManager } from "../../indentityManager";

interface IAccessInteraction {
    giveAccess(resource: string, consentId: string, account: string, identity: IdentityManager): Promise<any>;
    revokeAccess(resource: string, consentId: string, account: string, identity: IdentityManager): Promise<any>;
    checkAccess(resource: string, consentId: string, identity: IdentityManager): Promise<any>;
    getResourceByConsent(consentId: string, identity: IdentityManager): Promise<any>;
}

export default IAccessInteraction;