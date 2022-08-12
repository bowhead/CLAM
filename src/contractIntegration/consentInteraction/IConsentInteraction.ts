import { IdentityManager } from '../../indentityManager';

interface IConsentInteraction {
    saveConsent(consentId: string, identity: IdentityManager): Promise<any>;
    cancelConsent(consentId: string, identity: IdentityManager): Promise<any>;
    getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<any>;
    addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<any>;
    getKeys(consentId: string, identity: IdentityManager): Promise<any>;
}


export default IConsentInteraction;