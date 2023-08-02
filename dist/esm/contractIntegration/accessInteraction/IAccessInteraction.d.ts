import { IdentityManager } from '../../indentityManager';
import IAccessResource from './IAccessResource';
interface IAccessInteraction {
    giveAccess(resource: string, consentId: string, accounts: string[], resourceName: string, identity: IdentityManager): Promise<boolean>;
    checkAccess(resource: string, consentId: string, identity: IdentityManager): Promise<boolean>;
    getResourceByConsent(consentId: string, identity: IdentityManager): Promise<IAccessResource>;
}
export default IAccessInteraction;
