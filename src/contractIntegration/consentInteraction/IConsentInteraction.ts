import { IdentityManager } from '../../indentityManager';
import IConsentKeys from './IConsentKeys';

interface IConsentInteraction {
    saveConsent(consentId: string, identity: IdentityManager): Promise<string>;
    cancelConsent(consentId: string, identity: IdentityManager): Promise<string>;
    getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<boolean>;
    addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<string>;
    getKeys(consentId: string, identity: IdentityManager): Promise<IConsentKeys>;
}


export default IConsentInteraction;