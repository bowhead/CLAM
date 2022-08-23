/*global beforeEach, describe, test, expect*/

import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';
import Web3 from 'web3';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';

describe('Testing access interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;

    beforeEach(async () => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();
        
        const web3 = new Web3('http://localhost:8545');
        const consentConfig = { address: '0xD48A409F0b853EA933341366Afb79026a8b96f98', abi: ABIConsent.abi };
        const accessConfig = { address: '0x859768B0d2ed33eCe914Fd8B6EbcAE5288fb087a', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0xCDb2d33Ac1910BbfcDB0502Bf0d88A1c3495e967', abi: ABIConsentResource.abi };
        const IPFSManagementConfig = { address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', abi: ABIIPFSManagement.abi };
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);
        
        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        const identity: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
        await identity.generateIdentity();
        identity.address = '0x751bdD89dDD33849507334d9C802a15aAE05D826';
        identity.privateKey = '0x2bc3604040467f2db3a9a768fd1dca94d7e2d410ef4f65e6fccf0b80b9754ac2';
        interaction.setIdentity(identity);
    });

    test('should add a new consent', async () => {
        const result = await interaction.consentInteraction.saveConsent('AAA2', interaction.identity);
        expect(result).toBe(true);
    });

    test('should give access', async () => {
        const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const result = await interaction.acccessInteraction.giveAccess('BBB1', 'AAA2', [account], 'test.txt', interaction.identity);
        expect(result).toBe(true);
    });

    test('should check Access', async () => {
        const interactionX = { ...interaction };
        interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const result = await interaction.acccessInteraction.checkAccess('BBB1', 'AAA2', interactionX.identity);
        expect(result).toBe(true);
    });

    test('should get resource by consentId', async () => {
        const interactionX = { ...interaction };
        interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
        const result = await interaction.acccessInteraction.getResourceByConsent('AAA2', interactionX.identity);
        expect(result[0][0]).toBe('0x751bdD89dDD33849507334d9C802a15aAE05D826');
        expect(Web3.utils.toAscii(result[1][0]).includes('BBB1')).toBe(true);
    });

    test('should not give and revoke access (empty resource)', async () => {
        try {
            const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.acccessInteraction.giveAccess('', 'AAA2', [account], 'test.txt', interaction.identity);
            
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The resource must have at least one character');
        }
    });

    test('should not give and revoke access (empty consentID)', async () => {
        try {
            const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.acccessInteraction.giveAccess('BBB1', '', [account], 'test.txt', interaction.identity);
            
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The consentID must have at least one character');
        }
    });

    test('should not give and revoke access (empty account)', async () => {
        try {
            const account = '';
            const result = await interaction.acccessInteraction.giveAccess('BBB1', 'AAA2', [], 'test.txt', interaction.identity);
            
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Accounts must have at least one element');
        }
    });

    test('should not give and revoke access (invalid account)', async () => {
        try {
            const account = 'invalid account';
            const result = await interaction.acccessInteraction.giveAccess('BBB1', 'AAA2', [account], 'test.txt', interaction.identity);
            
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message.includes('INVALID_ARGUMENT')).toBe(true);
        }
    });

    test('should not check access (empty resource)', async () => {
        try {
            const interactionX = { ...interaction };
            interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.acccessInteraction.checkAccess('', 'AAA2', interactionX.identity);
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The resource must have at least one character');

        }
    });

    test('should not check access (empty consentID)', async () => {
        try {
            const interactionX = { ...interaction };
            interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.acccessInteraction.checkAccess('BBB1', '', interactionX.identity);
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The consentID must have at least one character');

        }
    });

    test('should not get resource by consent (empty consentID)', async () => {
        try {
            const interactionX = { ...interaction };
            interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
            const result = await interaction.acccessInteraction.getResourceByConsent('', interactionX.identity);
            expect(result[0][0]).toBe('0x751bdD89dDD33849507334d9C802a15aAE05D826');
            expect(Web3.utils.toAscii(result[1][0]).includes('BBB1')).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The consentID must have at least one character');

        }
    });

    test('should cancel consent', async () => {
        const result = await interaction.consentInteraction.cancelConsent('AAA2', interaction.identity);
        expect(result).toBe(true);
    });

});