import { IdentityManager } from '../../indentityManager';
import IConsentKeys from './IConsentKeys';

interface IConsentInteraction {
    saveConsent(consentId: string, identity: IdentityManager): Promise<boolean>;
    cancelConsent(consentId: string, identity: IdentityManager): Promise<boolean>;
    getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<boolean>;
    addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<boolean>;
    getKeys(consentId: string, identity: IdentityManager): Promise<IConsentKeys>;
}


export default IConsentInteraction;