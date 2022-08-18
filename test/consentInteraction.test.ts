/*global beforeEach, describe, test, expect*/

import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';
import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import Web3 from 'web3';

describe('Testing consent interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;
    let accounts: string[];
    const getProvider = () => {
        return require("ganache-cli").provider();
    }

    beforeEach(async () => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();

        const web3 = new Web3(getProvider());
        accounts = await web3.eth.getAccounts();
        const consentDeployConfig = { abi: JSON.stringify(ABIConsent.abi), bytecode: ABIConsent.bytecode }
        let consentDeployContract = new web3.eth.Contract(JSON.parse(consentDeployConfig.abi));
        const account = accounts[0];
        let payloadConsent = { data: consentDeployConfig.bytecode }
        let parameter = {
            from: account,
            gas: 6721975,
            gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei'))
        }
        let consentAddress: string = "";
        let accessAddress: string = "";
        let consentResourceAddress: string = "";
        await consentDeployContract.deploy(payloadConsent).send(parameter, (_err, transactionHash) => {
            return transactionHash;
        }).on('confirmation', () => { }).then((newContractInstance) => {
            consentAddress = newContractInstance.options.address;
        })


        const consentConfig = { address: consentAddress, abi: ABIConsent.abi };
        const accessConfig = { address: accessAddress, abi: ABIAccess.abi };
        const consentResourceConfig = { address: consentResourceAddress, abi: ABIConsentResource.abi };
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig);
        interaction = factoryInteraction.generateInteraction('clam', 'clam');
        const identity: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
        identity.address = account;
        interaction.setIdentity(identity);
    })

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
        const resultSave = await interaction.consentInteraction.saveConsent('AAA1', interaction.identity);
        expect(resultSave.includes('0x')).toBe(true);
        const resultGet = await interaction.consentInteraction.getConsentById('AAA1', interaction.identity.address, interaction.identity);
        expect(resultGet).toBe(true);
    });

    test('should not get a consent by id (Incorrect consentID)', async () => {
        try {
            const result = await interaction.consentInteraction.getConsentById('AAA3', interaction.identity.address, interaction.identity);
            expect(result).toBe(true);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('VM Exception while processing transaction: revert Consent not registered');

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

        const resultSave = await interaction.consentInteraction.saveConsent('AAA1', interaction.identity);
        expect(resultSave.includes('0x')).toBe(true);
        const address = accounts[1];
        const resultAdd = await interaction.consentInteraction.addKey('AAA1', address, 'pk1', interaction.identity);
        expect(resultAdd.includes('0x')).toBe(true);

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

        const resultSave = await interaction.consentInteraction.saveConsent('AAA1', interaction.identity);
        expect(resultSave.includes('0x')).toBe(true);
        const address = accounts[1];
        const resultAdd = await interaction.consentInteraction.addKey('AAA1', address, 'pk1', interaction.identity);
        expect(resultAdd.includes('0x')).toBe(true);

        const result = await interaction.consentInteraction.getKeys('AAA1', interaction.identity);
        expect(result[0][0]).toBe(accounts[1]);
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
});