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
    test('should acept consent', async () => {
        await interaction.consentInteraction.saveConsent("AAA1", interaction.identity);
    });

    test('should give access', async () => {
        const account = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
        const result = await interaction.acccessInteraction.giveAccess("BBB1", "AAA1", account, interaction.identity);
        expect(result.result.includes("0x")).toBe(true);
    });

    test('should check Access', async () => {
        const interactionX = { ...interaction }
        interactionX.identity.address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
        const result = await interaction.acccessInteraction.checkAccess("BBB1", "AAA1", interactionX.identity);
        expect(result.result).toBe(true);
    });

    test('should get resource by consentId', async () => {
        const interactionX = { ...interaction }
        interactionX.identity.address = "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6";
        const result = await interaction.acccessInteraction.getResourceByConsent("AAA1", interactionX.identity);
        expect(result.result[0][0]).toBe("0x751bdD89dDD33849507334d9C802a15aAE05D826");
        expect(Web3.utils.toAscii(result.result[1][0]).includes("BBB1")).toBe(true);

    });

    test('should revoke Access', async () => {
        const result = await interaction.acccessInteraction.revokeAccess("BBB1", "AAA1", "0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6", interaction.identity);
        expect(result.result.includes("0x")).toBe(true);
    });




    test('should cancel consent', async () => {
        await interaction.consentInteraction.cancelConsent("AAA1", interaction.identity);
    });

});