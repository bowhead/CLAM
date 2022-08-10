import { FactoryInteraction, Interaction } from "../src/contractIntegration";
import { FactoryIdentity, IdentityManager } from "../src/";
import Web3Provider from "../src/contractIntegration/interaction/Wbe3Provider";
import Web3 from "web3";

import ABIConsent from "../src/contractIntegration/utilities/Consent.json";
import ABIAccess from "../src/contractIntegration/utilities/Access.json";
import ABIConsentResource from "../src/contractIntegration/utilities/Consent.json";


describe('Testing access interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;
    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();

        const urlProvider = "http://localhost:8545";
        const consentConfig = { address: "0x4ce804103f98D14d76873D55ba8dc13B3bB72906", abi: ABIConsent.abi };
        const accessConfig = { address: "0xd7EeA4678B700fB5BA8496C8C1c3B2d6df8Fd384", abi: ABIAccess.abi };
        const consentResourceConfig = { address: "0x7564Ee00E0261e92b61ddf2C75CeF440c089dAB8", abi: ABIConsentResource.abi };
        web3Provider.setConfig(urlProvider, consentConfig, accessConfig, consentResourceConfig);

        interaction = factoryInteraction.generateInteraction("clam", "clam");
        const identity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
        identity.address = "0x751bdD89dDD33849507334d9C802a15aAE05D826";
        interaction.setIdentity(identity);
    });
    test('should acept consent', async () => {
        await interaction.consentInteraction.saveConsent("AAA2", interaction.identity);
    });

    test('should give access', async () => {
        const account = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
        const result = await interaction.acccessInteraction.giveAccess("BBB1", "AAA2", account, interaction.identity);
        expect(result.result.includes("0x")).toBe(true);
    });


    test('should check Access', async () => {
        const interactionX = { ...interaction }
        interactionX.identity.address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
        const result = await interaction.acccessInteraction.checkAccess("BBB1", "AAA2", interactionX.identity);
        expect(result.result).toBe(true);
    });

    test('should get resource by consentId', async () => {
        const interactionX = { ...interaction }
        interactionX.identity.address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
        const result = await interaction.acccessInteraction.getResourceByConsent("AAA2", interactionX.identity);
        expect(result.result[0][0]).toBe("0x751bdD89dDD33849507334d9C802a15aAE05D826");
        expect(Web3.utils.toAscii(result.result[1][0]).includes("BBB1")).toBe(true);

    });

    test('should revoke Access', async () => {
        const result = await interaction.acccessInteraction.revokeAccess("BBB1", "AAA2", "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6", interaction.identity);
        expect(result.result.includes("0x")).toBe(true);
    });


    test('should not give and revoke access (empty resource)', async () => {
        try {
            const account = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.acccessInteraction.giveAccess("", "AAA2", account, interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The resource must have at least one character");
        }
        try {
            const account = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.acccessInteraction.revokeAccess("", "AAA2", account, interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The resource must have at least one character");
        }
    });
    test('should not give and revoke access (empty consentID)', async () => {
        try {
            const account = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.acccessInteraction.giveAccess("BBB1", "", account, interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The consentID must have at least one character");
        }
        try {
            const account = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.acccessInteraction.revokeAccess("BBB1", "", account, interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The consentID must have at least one character");
        }
    });
    test('should not give and revoke access (empty account)', async () => {
        try {
            const account = "";
            const result = await interaction.acccessInteraction.giveAccess("BBB1", "AAA2", account, interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The account must have at least one character");
        }
        try {
            const account = "";
            const result = await interaction.acccessInteraction.revokeAccess("BBB1", "AAA2", account, interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The account must have at least one character");
        }
    });
    test('should not give and revoke access (invalid account)', async () => {
        try {
            const account = "invalid account";
            const result = await interaction.acccessInteraction.giveAccess("BBB1", "AAA2", account, interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The account format is invalid");
        }
        try {
            const account = "invalid account";
            const result = await interaction.acccessInteraction.revokeAccess("BBB1", "AAA2", account, interaction.identity);
            expect(result.result.includes("0x")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The account format is invalid");
        }
    });

    test('should not check access (empty resource)', async () => {
        try {
            const interactionX = { ...interaction }
            interactionX.identity.address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.acccessInteraction.checkAccess("", "AAA2", interactionX.identity);
            expect(result.result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The resource must have at least one character");
        }
    });
    test('should not check access (empty consentID)', async () => {
        try {
            const interactionX = { ...interaction }
            interactionX.identity.address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.acccessInteraction.checkAccess("BBB1", "", interactionX.identity);
            expect(result.result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The consentID must have at least one character");
        }
    });

    test('should not get resource by consent (empty consentID)', async () => {
        try {
            const interactionX = { ...interaction }
            interactionX.identity.address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
            const result = await interaction.acccessInteraction.getResourceByConsent("", interactionX.identity);
            expect(result.result[0][0]).toBe("0x751bdD89dDD33849507334d9C802a15aAE05D826");
            expect(Web3.utils.toAscii(result.result[1][0]).includes("BBB1")).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The consentID must have at least one character");
        }
    });

    
    test('should cancel consent', async () => {
        await interaction.consentInteraction.cancelConsent("AAA2", interaction.identity);
    });


});