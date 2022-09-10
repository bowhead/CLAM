/*global beforeEach, describe, test, expect*/
require('dotenv').config()
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

        const web3 = new Web3(String(process.env.CLAM_BLOCKCHAIN_LOCALTION));
        const consentConfig = { address: process.env.CLAM_CONSENT_ADDRESS, abi: ABIConsent.abi };
        const accessConfig = { address: process.env.CLAM_ACCESS_ADDRESS, abi: ABIAccess.abi };
        const consentResourceConfig = { address: process.env.CLAM_CONSENT_RESOURCE_ADDRESS, abi: ABIConsentResource.abi };
        const IPFSManagementConfig = { address: process.env.CLAM_IPFS_ADDRESS, abi: ABIIPFSManagement.abi };
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        const identity: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
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