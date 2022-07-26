import IConsentInteraction from "./IConsentInteraction";

class ConsentInteraction implements IConsentInteraction {
    public saveConsent = async (): Promise<boolean> => {
        return true;
    }
    public cancelConsent = async (): Promise<boolean> => {
        return true;
    }
    public getConsentById = async (): Promise<boolean> => {
        return true;
    }

}

export default ConsentInteraction;