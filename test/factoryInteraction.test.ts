import { FactoryInteraction, IAccessInteraction, IConsentInteraction } from "../src/contractIntegration";
describe('Testing interaction component using the CLAM implementation', () => {

    test('should the factoryInteraction instance have a good structure', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        const keys = Object.keys(factoryInteraction);
        expect(keys.includes("optionsConsentInteraction")).toBe(true);
        expect(keys.includes("optionsAccessInteraction")).toBe(true);
        expect(keys.length).toBe(2);
    })
    test('should generate an interaction with the clam implementations', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        const interaction = factoryInteraction.generateInteraction("clam", "clam");
        const keys = Object.keys(interaction);
        expect(keys.includes("acccessInteraction")).toBe(true);
        expect(keys.includes("consentInteraction")).toBe(true);
        expect(keys.length).toBe(2);
    });
    test('should not generate an interaction if we dont specifie the consentInteraction type', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction("not", "clam");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The consentInteraction type doesn't exist");
        }
    });
    test('should not generate an interaction if we dont specifie the accessInteraction type', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction("clam", "not");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The accessInteraction type doesn't exist");
        }
    });
    test('should add a new implementation to the FactoryInteraction', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        factoryInteraction.setOptionConsentInteraction({ name: "other", option: ConsentInteractionOther });

    });
    test('should generate an instance of interaction based on the new consent implementation.', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        factoryInteraction.setOptionConsentInteraction({ name: "other", option: ConsentInteractionOther });
        const interactionOther = factoryInteraction.generateInteraction("other", "clam");
        expect(interactionOther).not.toBe(null);
    });
    test('should generate an instance of interaction based on the new access implementation.', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        factoryInteraction.setOptionAccessInteraction({ name: "other", option: AccessInteractionOther });
        const interactionOther = factoryInteraction.generateInteraction("clam", "other");
        expect(interactionOther).not.toBe(null);
    });
    test('should generate an instance of interaction based on the new access and consent implementations.', () => {
        const factoryInteraction: FactoryInteraction = new FactoryInteraction();
        factoryInteraction.setOptionAccessInteraction({ name: "other", option: AccessInteractionOther });
        factoryInteraction.setOptionConsentInteraction({ name: "other", option: ConsentInteractionOther });
        const interactionOther = factoryInteraction.generateInteraction("other", "other");
        expect(interactionOther).not.toBe(null);
    });


    test('should throw an error if we want to add an existing implementation in consent. ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionConsentInteraction({ name: "clam", option: ConsentInteractionOther });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("This option already exists.");
        }
    });
    test('should throw an error if we want to add an existing implementation in access. ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionAccessInteraction({ name: "clam", option: AccessInteractionOther });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("This option already exists.");
        }
    });
    test('should throw an error if we want to add a new implementation of consent with the name empty ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionConsentInteraction({ name: "", option: ConsentInteractionOther });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The name must have at least one character");
        }
    });
    test('should throw an error if we want to add a new implementation of access with the name empty ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.setOptionAccessInteraction({ name: "", option: AccessInteractionOther });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The name must have at least one character");
        }
    });
    test('should throw an error if we want to generate an interaction without consent type ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction("", "clam");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The consent implementation name must have a minimum of one character");
        }
    });
    test('should throw an error if we want to generate an interaction without access type ', () => {
        try {
            const factoryInteraction: FactoryInteraction = new FactoryInteraction();
            factoryInteraction.generateInteraction("clam", "");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The access implementation name must have a minimum of one character");
        }
    });
});

class ConsentInteractionOther implements IConsentInteraction {
    saveConsent(consentId: string, status: boolean): Promise<any> {
        console.log(consentId, status);
        throw new Error("Method not implemented.");
    }
    cancelConsent(consentId: string, status: boolean): Promise<any> {
        console.log(consentId, status);
        throw new Error("Method not implemented.");
    }
    getConsentById(consentId: string, owner: string): Promise<any> {
        console.log(consentId, owner);
        throw new Error("Method not implemented.");
    }
    addKey(consentId: string, addressConsent: string, key: string): Promise<any> {
        console.log(consentId, addressConsent, key);
        throw new Error("Method not implemented.");
    }
    getKeys(consentId: string): Promise<any> {
        console.log(consentId);
        throw new Error("Method not implemented.");
    }

}

class AccessInteractionOther implements IAccessInteraction {
    giveAccess(resource: string, consentId: string, account: string): Promise<any> {
        console.log(resource, consentId, account);
        throw new Error("Method not implemented.");
    }
    revokeAccess(resource: string, consentId: string, account: string): Promise<any> {
        console.log(resource, consentId, account);
        throw new Error("Method not implemented.");
    }
    checkAccess(resource: string, consentId: string): Promise<any> {
        console.log(resource, consentId);
        throw new Error("Method not implemented.");
    }
    getResourceByConsent(consentId: string): Promise<any> {
        console.log(consentId);
        throw new Error("Method not implemented.");
    }
}