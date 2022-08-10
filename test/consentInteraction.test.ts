import { FactoryInteraction, Interaction } from "../src/contractIntegration";
import { FactoryIdentity, IdentityManager } from "../src/";
import Web3Provider from "../src/contractIntegration/interaction/Wbe3Provider";

import ABIConsent from "../src/contractIntegration/utilities/Consent.json";
import ABIAccess from "../src/contractIntegration/utilities/Consent.json";
import ABIConsentResource from "../src/contractIntegration/utilities/Consent.json";


describe('Testing consent interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;
    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();
       

        const urlProvider= "http://localhost:8545";
        const consentConfig = { address: "0xD48A409F0b853EA933341366Afb79026a8b96f98", abi: ABIConsent.abi };
        const accessConfig = { address: "0x859768B0d2ed33eCe914Fd8B6EbcAE5288fb087a", abi: ABIAccess.abi };
        const consentResourceConfig = { address: "0xCDb2d33Ac1910BbfcDB0502Bf0d88A1c3495e967", abi: ABIConsentResource.abi };
        web3Provider.setConfig(urlProvider, consentConfig, accessConfig, consentResourceConfig);

        interaction = factoryInteraction.generateInteraction("clam", "clam");
        const identity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
        identity.address = "0x751bdD89dDD33849507334d9C802a15aAE05D826";
        interaction.setIdentity(identity);
    });

    test('should add a new consent', async () => {
        const result = await interaction.consentInteraction.saveConsent("AAA1", interaction.identity);
        expect(result.result.includes("0x")).toBe(true);
    });

    test('should not add a new consent', async () => {
        try {
            const result = await interaction.consentInteraction.saveConsent("", interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("contentID must have at least 1 character");
        }
    });

    test('should get cosent by id', async () => {
        const result = await interaction.consentInteraction.getConsentById("AAA1", interaction.identity.address, interaction.identity);
        expect(result.result).toBe(true);
    });

    test('should not get a consent by id (Incorrect consentID)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById("AAA2", interaction.identity.address, interaction.identity);
            expect(result.result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Returned error: VM Exception while processing transaction: revert Consent not registered");
        }
    });

    test('should not get a consent by id (empty consentID)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById("", interaction.identity.address, interaction.identity);
            expect(result.result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("contentID must have at least 1 character");
        }
    });

    test('should not get a consent by id (empty owner)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById("AAA1", "", interaction.identity);
            expect(result.result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Owner must have at least 1 character");
        }
    });

    test('should not get a consent by id (invalid owner)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById("AAA1", "invalid", interaction.identity);
            expect(result.result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Invalid owner, the string with has a correct format.");
        }
    });

    test('should add keys', async () => {
        const address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
        const result = await interaction.consentInteraction.addKey("AAA1", address, "pk1", interaction.identity);
        expect(result.result.includes("0x")).toBe(true);
    });

    test('should not add keys (empty consentID)', async () => {
        try {
            const address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.consentInteraction.addKey("", address, "pk1", interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("contentID must have at least 1 character");
        }
    });

    test('should not add keys (empty addressConsent)', async () => {
        try {
            const address = "";
            const result = await interaction.consentInteraction.addKey("AAA1", address, "pk1", interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("AddressConsent must have at least 1 character");
        }
    });

    test('should not add keys (invalid addressConsent)', async () => {
        try {
            const address = "invalid";
            const result = await interaction.consentInteraction.addKey("AAA1", address, "pk1", interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Invalid addressConsent, the string with has a correct format.");
        }
    });

    test('should not add keys (empty key)', async () => {
        try {
            const address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.consentInteraction.addKey("AAA1", address, "", interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Key must have at least 1 character");
        }
    });

    test('should get keys', async () => {
        const result = await interaction.consentInteraction.getKeys("AAA1", interaction.identity);
        expect(result.result[0][0]).toBe("0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6");
        expect(result.result[1][0]).toBe("pk1");
    });

    test('should not get keys (empty consentID)', async () => {
        try {
            const result = await interaction.consentInteraction.getKeys("", interaction.identity);
            expect(result.result[0][0]).toBe("0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6");
            expect(result.result[1][0]).toBe("pk1");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("contentID must have at least 1 character");
        }
    });

    test('should cancel consent', async () => {
        const result = await interaction.consentInteraction.cancelConsent("AAA1", interaction.identity);
        expect(result.result.includes("0x")).toBe(true);
    });

    test('should not cancel consent', async () => {
        try {
            const result = await interaction.consentInteraction.cancelConsent("", interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("contentID must have at least 1 character");
        }
    });
});