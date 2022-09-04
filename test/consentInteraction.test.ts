/*global beforeEach, describe, test, expect*/

import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
import Web3Provider from '../src/contractIntegration/interaction/Web3Provider';
import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

describe('Testing consent interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;

    const consent = (Math.random() + 1).toString(36).substring(7);

    beforeEach(async () => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();

        const web3 = new Web3('http://localhost:8545');
        const consentConfig = { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent.abi as unknown as AbiItem };
        const accessConfig = { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess.abi as unknown as AbiItem };
        const consentResourceConfig = { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412', abi: ABIConsentResource.abi as unknown as AbiItem };
        const IPFSManagementConfig = { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement.abi as unknown as AbiItem };
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        const identity: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        await identity.generateIdentity();
        identity.address = '0x8B3921DA1090CF8de6a34dcb929Be0df53AB81Fa';
        identity.privateKey = '0a6a24eac9cd5adf1d4b447fdc3316623d362480d6a835da70860b4d4cb0f82f';
        interaction.setIdentity(identity);
    });

    test('should add a new consent', async () => {
        const result = await interaction.consentInteraction.saveConsent(consent, interaction.identity);
        expect(result).toBe(true);
    });

    test('should not add a new consent', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.saveConsent('', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('contentID must have at least 1 character');
    });

    test('should get consent by id', async () => {
        const resultGet = await interaction.consentInteraction.getConsentById(consent, interaction.identity.address, interaction.identity);
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
            const result = await interaction.consentInteraction.getConsentById(consent, '', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Owner must have at least 1 character');
    });

    test('should not get a consent by id (invalid owner)', async () => {
        await expect(async () => {
            const result = await interaction.consentInteraction.getConsentById(consent, 'invalid', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Invalid owner, the string with has a correct format.');
    });

    test('should add keys', async () => {
        const address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const resultAdd = await interaction.consentInteraction.addKey(consent, address, 'pk1', interaction.identity);
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
            const result = await interaction.consentInteraction.addKey(consent, address, 'pk1', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('AddressConsent must have at least 1 character');
    });

    test('should not add keys (invalid addressConsent)', async () => {
        await expect(async () => {
            const address = 'invalid';
            const result = await interaction.consentInteraction.addKey(consent, address, 'pk1', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Invalid addressConsent, the string with has a correct format.');
    });

    test('should not add keys (empty key)', async () => {
        await expect(async () => {
            const address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.consentInteraction.addKey(consent, address, '', interaction.identity);
            expect(result).toBe(true);
        }).rejects.toThrow('Key must have at least 1 character');
    });

    test('should get keys', async () => {
        const result = await interaction.consentInteraction.getKeys(consent, interaction.identity);
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
        const result = await interaction.consentInteraction.cancelConsent(consent, interaction.identity);
        expect(result).toBe(true);
    });
});