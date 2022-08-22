/*global beforeEach, describe, test, expect*/

import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';


describe('Testing consent interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;
    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();


        const urlProvider = 'http://localhost:8545';
        const consentConfig = { address: '0xd7EeA4678B700fB5BA8496C8C1c3B2d6df8Fd384', abi: ABIConsent.abi };
        const accessConfig = { address: '0xC152fb199e0C9CAB597BbBc55638f78C3b729656', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0x7564Ee00E0261e92b61ddf2C75CeF440c089dAB8', abi: ABIConsentResource.abi };
        const IPFSManagementConfig = { address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', abi: ABIIPFSManagement.abi };
        web3Provider.setConfig(urlProvider, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');
        const identity: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
        identity.address = '0x751bdD89dDD33849507334d9C802a15aAE05D826';

        interaction.setIdentity(identity);
    });

    test('should add a new consent', async () => {
        const result = await interaction.consentInteraction.saveConsent('AAA1', interaction.identity);
        expect(result.includes('0x')).toBe(true);

    });

    test('should not add a new consent', async () => {
        try {
            const result = await interaction.consentInteraction.saveConsent('', interaction.identity);
            expect(result.includes('0x')).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('contentID must have at least 1 character');

        }
    });

    test('should get cosent by id', async () => {
        const result = await interaction.consentInteraction.getConsentById('AAA1', interaction.identity.address, interaction.identity);
        expect(result).toBe(true);

    });

    test('should not get a consent by id (Incorrect consentID)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById('AAA3', interaction.identity.address, interaction.identity);
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Returned error: VM Exception while processing transaction: revert Consent not registered');

        }
    });

    test('should not get a consent by id (empty consentID)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById('', interaction.identity.address, interaction.identity);
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('contentID must have at least 1 character');

        }
    });

    test('should not get a consent by id (empty owner)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById('AAA1', '', interaction.identity);
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Owner must have at least 1 character');

        }
    });

    test('should not get a consent by id (invalid owner)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById('AAA1', 'invalid', interaction.identity);
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Invalid owner, the string with has a correct format.');

        }
    });

    test('should add keys', async () => {
        const address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const result = await interaction.consentInteraction.addKey('AAA1', address, 'pk1', interaction.identity);
        expect(result.includes('0x')).toBe(true);

    });

    test('should not add keys (empty consentID)', async () => {
        try {
            const address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.consentInteraction.addKey('', address, 'pk1', interaction.identity);
            expect(result.includes('0x')).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('contentID must have at least 1 character');

        }
    });

    test('should not add keys (empty addressConsent)', async () => {
        try {
            const address = '';
            const result = await interaction.consentInteraction.addKey('AAA1', address, 'pk1', interaction.identity);
            expect(result.includes('0x')).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('AddressConsent must have at least 1 character');

        }
    });

    test('should not add keys (invalid addressConsent)', async () => {
        try {
            const address = 'invalid';
            const result = await interaction.consentInteraction.addKey('AAA1', address, 'pk1', interaction.identity);
            expect(result.includes('0x')).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Invalid addressConsent, the string with has a correct format.');

        }
    });

    test('should not add keys (empty key)', async () => {
        try {
            const address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.consentInteraction.addKey('AAA1', address, '', interaction.identity);
            expect(result.includes('0x')).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Key must have at least 1 character');

        }
    });

    test('should get keys', async () => {
        const result = await interaction.consentInteraction.getKeys('AAA1', interaction.identity);
        expect(result[0][0]).toBe('0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6');
        expect(result[1][0]).toBe('pk1');

    });

    test('should not get keys (empty consentID)', async () => {
        try {
            const result = await interaction.consentInteraction.getKeys('', interaction.identity);
            expect(result[0][0]).toBe('0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6');
            expect(result[1][0]).toBe('pk1');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('contentID must have at least 1 character');

        }
    });

    test('should not cancel consent', async () => {
        try {
            const result = await interaction.consentInteraction.cancelConsent('', interaction.identity);
            expect(result.includes('0x')).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('contentID must have at least 1 character');

        }
    });

    test('should cancel consent', async () => {
        const result = await interaction.consentInteraction.cancelConsent('AAA1', interaction.identity);
        expect(result.includes('0x')).toBe(true);

    });
});