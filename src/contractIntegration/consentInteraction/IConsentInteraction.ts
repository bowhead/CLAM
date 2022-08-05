interface IConsentInteraction {
    saveConsent(consentId: string, status: boolean): Promise<any>;
    cancelConsent(consentId: string, status: boolean): Promise<any>;
    getConsentById(consentId: string, owner: string): Promise<any>;
    addKey(consentId: string, addressConsent: string, key: string): Promise<any>;
    getKeys(consentId: string): Promise<any>
}


export default IConsentInteraction;