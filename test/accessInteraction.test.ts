/*global beforeEach, describe, test, expect*/

import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
import Web3Provider from '../src/contractIntegration/interaction/Web3Provider';
import Web3 from 'web3';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import { AbiItem } from 'web3-utils';

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
        const consentConfig = { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent.abi as unknown as AbiItem };
        const accessConfig = { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess.abi as unknown as AbiItem};
        const consentResourceConfig = { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412', abi: ABIConsentResource.abi as unknown as AbiItem};
        const IPFSManagementConfig = { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement.abi as unknown as AbiItem};
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        const identity: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        await identity.generateIdentity();
        identity.address = '0x8B3921DA1090CF8de6a34dcb929Be0df53AB81Fa';
        identity.privateKey = '0a6a24eac9cd5adf1d4b447fdc3316623d362480d6a835da70860b4d4cb0f82f';
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
        expect(result[0][0]).toBe('0x8B3921DA1090CF8de6a34dcb929Be0df53AB81Fa');
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