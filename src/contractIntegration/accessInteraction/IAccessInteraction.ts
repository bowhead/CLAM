interface IAccessInteraction {
    giveAccess(resource: string, consentId: string, account: string): Promise<any>;
    revokeAccess(resource: string, consentId: string, account: string): Promise<any>;
    checkAccess(resource: string, consentId: string): Promise<any>;
    getResourceByConsent(consentId: string): Promise<any>;
}

export default IAccessInteraction;