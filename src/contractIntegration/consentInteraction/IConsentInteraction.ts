interface IConsentInteraction {

    saveConsent(): Promise<boolean>;
    cancelConsent(): Promise<boolean>;
    getConsentById(): Promise<boolean>;
}


export default IConsentInteraction;