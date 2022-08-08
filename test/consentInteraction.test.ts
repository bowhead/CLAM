import { FactoryInteraction, Interaction } from "../src/contractIntegration";
import { FactoryIdentity, IdentityManager } from "../src/";
import Web3Provider from "../src/contractIntegration/interaction/Wbe3Provider";
describe('Testing consent interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;
    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();
        web3Provider.setUrlProvider("http://localhost:8545");
        interaction = factoryInteraction.generateInteraction("clam", "clam");
        const identity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
        identity.address = "0x751bdD89dDD33849507334d9C802a15aAE05D826";
        interaction.setIdentity(identity);
    });


    test('should add a new consent', async () => {
        try {
            const result = await interaction.consentInteraction.saveConsent("AAA1", interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Returned error: VM Exception while processing transaction: revert Status consent is already setted up");
        }
    });

    test('should get cosent by id', async () => {
        const result = await interaction.consentInteraction.getConsentById("AAA1", interaction.identity.address, interaction.identity);
        expect(result.result).toBe(true);
    });

    test('should not get a consent by id', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById("AAA2", interaction.identity.address, interaction.identity);
            expect(result.result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Returned error: VM Exception while processing transaction: revert Consent not registered");
        }
    });

    test('should add keys', async () => {
        const address = "0xE0e572FE2D9675ec8ff8641c9E51D51c624008Ab";
        const result = await interaction.consentInteraction.addKey("AAA1", address, "pk1", interaction.identity);
        console.log(result.result);
    });

    test('should get keys', async () => {
        const result = await interaction.consentInteraction.getKeys("AAA1", interaction.identity);
        console.log(result.result);
    });

    test('should cancel consent', async () => {
        const result = await interaction.consentInteraction.cancelConsent("AAA1", interaction.identity);
        expect(result.result.includes("0x")).toBe(true);
    });
});