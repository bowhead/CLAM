import IConsentInteraction from "./IConsentInteraction";

class ConsentInteraction implements IConsentInteraction {
    saveConsent(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    cancelConsent(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getConsentById(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}

export default ConsentInteraction;