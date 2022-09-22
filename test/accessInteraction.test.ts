// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';

import Web3 from 'web3';
import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import IInteractionConfig from '../src/contractIntegration/interaction/IInteractionConfig';
import FactoryWeb3Interaction from '../src/contractIntegration/interaction/web3Provider/FactoryWeb3Interaction';

describe('Testing access interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let factoryWeb3Provider: FactoryWeb3Interaction;
    let interaction: Interaction;

    beforeEach(async () => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        factoryWeb3Provider = FactoryWeb3Interaction.getInstance();

        const interactionConfig: IInteractionConfig = {
            provider: new Web3(String(process.env.CLAM_BLOCKCHAIN_LOCALTION)),
            consent: { address: String(process.env.CLAM_CONSENT_ADDRESS), abi: ABIConsent.abi },
            access: { address: String(process.env.CLAM_ACCESS_ADDRESS), abi: ABIAccess.abi },
            consentResource: { address: String(process.env.CLAM_CONSENT_RESOURCE_ADDRESS), abi: ABIConsentResource.abi },
            ipfs: { address: String(process.env.CLAM_IPFS_ADDRESS), abi: ABIIPFSManagement.abi }
        }

        factoryWeb3Provider.setConfig(interactionConfig);
        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        const identity: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');

        await identity.generateIdentity();
        identity.address = String(process.env.CLAM_USER_ADDRESS);
        identity.privateKey = String(process.env.CLAM_USER_PRIVATEKEY);
        interaction.setIdentity(identity);
    });

    test('should add a new consent', async () => {
        const result = await interaction.consentInteraction.saveConsent('AAA2', interaction.identity);
        expect(result).toBe(true);
    });

    test('should give access', async () => {
        const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const result = await interaction.accessInteraction.giveAccess('BBB1', 'AAA2', [account], 'test.txt', interaction.identity);
        expect(result).toBe(true);
    });

    test('should check Access', async () => {
        const interactionX = { ...interaction };
        interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const result = await interaction.accessInteraction.checkAccess('BBB1', 'AAA2', interactionX.identity);
        expect(result).toBe(true);
    });

    test('should get resource by consentId', async () => {
        const interactionX = { ...interaction };
        interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const result = await interaction.accessInteraction.getResourceByConsent('AAA2', interactionX.identity);

        expect(result[0][0]).toBe('0x751bdD89dDD33849507334d9C802a15aAE05D826');

        expect(result[1][0].includes('BBB1')).toBe(true);
    });

    test('should not give and revoke access (empty resource)', async () => {
        await expect(async () => {
            const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.accessInteraction.giveAccess('', 'AAA2', [account], 'test.txt', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('The resource must have at least one character');
    });

    test('should not give and revoke access (empty consentID)', async () => {
        await expect(async () => {
            const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.accessInteraction.giveAccess('BBB1', '', [account], 'test.txt', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('The consentID must have at least one character');
    });

    test('should not give and revoke access (empty account)', async () => {
        await expect(async () => {
            const result = await interaction.accessInteraction.giveAccess('BBB1', 'AAA2', [], 'test.txt', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Accounts must have at least one element');
    });

    test('should not give and revoke access (invalid account)', async () => {
        await expect(async () => {
            const account = 'invalid account';
            const result = await interaction.accessInteraction.giveAccess('BBB1', 'AAA2', [account], 'test.txt', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('INVALID_ARGUMENT');
    });

    test('should not check access (empty resource)', async () => {
        await expect(async () => {
            const interactionX = { ...interaction };
            interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.accessInteraction.checkAccess('', 'AAA2', interactionX.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('The resource must have at least one character');
    });

    test('should not check access (empty consentID)', async () => {
        await expect(async () => {
            const interactionX = { ...interaction };
            interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.accessInteraction.checkAccess('BBB1', '', interactionX.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('The consentID must have at least one character');
    });

    test('should not get resource by consent (empty consentID)', async () => {
        await expect(async () => {
            const interactionX = { ...interaction };
            interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.accessInteraction.getResourceByConsent('', interactionX.identity);
            expect(result[0][0]).toBe('0x751bdD89dDD33849507334d9C802a15aAE05D826');
            expect(Web3.utils.toAscii(result[1][0]).includes('BBB1')).toBe(true);
        }).rejects.toThrow('The consentID must have at least one character');
    });

    test('should cancel consent', async () => {
        const result = await interaction.consentInteraction.cancelConsent('AAA2', interaction.identity);
        expect(result).toBe(true);
    });

});