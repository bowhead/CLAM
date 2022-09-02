/*global beforeEach, describe, test, expect*/
require('dotenv').config();
import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
//import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';
import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import IInteractionConfig from '../src/contractIntegration/interaction/IInteractionConfig';
import FactoryWeb3Interaction from "../src/contractIntegration/interaction/web3Provider/FactoryWeb3Interaction"

describe('Testing consent interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let factoryWeb3Provider: FactoryWeb3Interaction;
    let interaction: Interaction;

    beforeEach(async () => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        factoryWeb3Provider = FactoryWeb3Interaction.getInstance();
        const interactionConfig:IInteractionConfig = {
            provider: String(process.env.CLAM_BLOCKCHAIN_LOCALTION),
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
    })

    test('should add a new consent', async () => {
        const result = await interaction.consentInteraction.saveConsent('AAA1', interaction.identity);
        expect(result).toBe(true);
    });

    test('should not add a new consent', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.saveConsent('', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('contentID must have at least 1 character');
    });

    test('should get cosent by id', async () => {
        const resultGet = await interaction.consentInteraction.getConsentById('AAA1', interaction.identity.address, interaction.identity);
        expect(resultGet).toBe(true);
    });

    test('should not get a consent by id (Incorrect consentID)', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.getConsentById('AAA3', interaction.identity.address, interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Returned error: VM Exception while processing transaction: revert Consent not registered');
    });

    test('should not get a consent by id (empty consentID)', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.getConsentById('', interaction.identity.address, interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('contentID must have at least 1 character');
    });

    test('should not get a consent by id (empty owner)', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.getConsentById('AAA1', '', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Owner must have at least 1 character');
    });

    test('should not get a consent by id (invalid owner)', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.getConsentById('AAA1', 'invalid', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Invalid owner, the string with has a correct format.');
    });

    test('should add keys', async () => {
        const address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const resultAdd = await interaction.consentInteraction.addKey('AAA1', address, 'pk1', interaction.identity);
        expect(resultAdd).toBe(true);

    });

    test('should not add keys (empty consentID)', async () => {
        await expect(async () => {
            const address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.consentInteraction.addKey('', address, 'pk1', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('contentID must have at least 1 character');
    });

    test('should not add keys (empty addressConsent)', async () => {
        await expect(async () => {
            const address = '';
            const result = await interaction.consentInteraction.addKey('AAA1', address, 'pk1', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('AddressConsent must have at least 1 character');
    });

    test('should not add keys (invalid addressConsent)', async () => {
        await expect(async () => {
            const address = 'invalid';
            const result = await interaction.consentInteraction.addKey('AAA1', address, 'pk1', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Invalid addressConsent, the string with has a correct format.');
    });

    test('should not add keys (empty key)', async () => {
        await expect(async () => {
            const address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.consentInteraction.addKey('AAA1', address, '', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Key must have at least 1 character');
    });

    test('should get keys', async () => {
        const result = await interaction.consentInteraction.getKeys('AAA1', interaction.identity);
        expect(result[0][0]).toBe('0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6');
        expect(result[1][0]).toBe('pk1');
    });

    test('should not get keys (empty consentID)', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.getKeys('', interaction.identity);
            expect(result[0][0]).toBe('0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6');
            expect(result[1][0]).toBe('pk1');
        }).rejects.toThrow('contentID must have at least 1 character');
    });

    test('should not cancel consent', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.cancelConsent('', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('contentID must have at least 1 character');
    });

    test('should cancel consent', async () => {
        const result = await interaction.consentInteraction.cancelConsent("AAA1", interaction.identity);
        expect(result).toBe(true)
    });
});