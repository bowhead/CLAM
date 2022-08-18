/*global beforeEach, describe, test, expect*/

import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';
import Web3 from 'web3';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';

const { ethers, upgrades } = require("hardhat");



describe('Testing access interaction', () => {
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
        const accessDeployConfig = { abi: JSON.stringify(ABIAccess.abi), bytecode: ABIAccess.bytecode }
        const consentResourceDeployConfig = { abi: JSON.stringify(ABIConsentResource.abi), bytecode: ABIConsentResource.bytecode }

        let consentDeployContract = new web3.eth.Contract(JSON.parse(consentDeployConfig.abi));
        let accessDeployContract = new web3.eth.Contract(JSON.parse(accessDeployConfig.abi));
        let consentResourceDeployContract = new web3.eth.Contract(JSON.parse(consentResourceDeployConfig.abi));

        const account = accounts[0];
        let payloadConsent = { data: consentDeployConfig.bytecode }
        let payloadAccess = { data: accessDeployConfig.bytecode }
        let payloadConsentResource = { data: consentResourceDeployConfig.bytecode }

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
        await accessDeployContract.deploy(payloadAccess).send(parameter, (_err, transactionHash) => {
            return transactionHash;
        }).on('confirmation', () => { }).then((newContractInstance) => {
            accessAddress = newContractInstance.options.address;
        })
        await consentResourceDeployContract.deploy(payloadConsentResource).send(parameter, (_err, transactionHash) => {
            return transactionHash;
        }).on('confirmation', () => { }).then((newContractInstance) => {
            consentResourceAddress = newContractInstance.options.address;
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



    test('should give access', async () => {
        console.log(upgrades, ethers);

        // await interaction.consentInteraction.saveConsent('AAA2', interaction.identity);
        // const account = accounts[1];
        // const result = await interaction.acccessInteraction.giveAccess('BBB1', 'AAA2', account, interaction.identity);
        // expect(result.includes('0x')).toBe(true);
    });


    // test('should check Access', async () => {
    //     const interactionX = { ...interaction };
    //     interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //     const result = await interaction.acccessInteraction.checkAccess('BBB1', 'AAA2', interactionX.identity);
    //     expect(result).toBe(true);
    // });

    // test('should get resource by consentId', async () => {
    //     const interactionX = { ...interaction };
    //     interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //     const result = await interaction.acccessInteraction.getResourceByConsent('AAA2', interactionX.identity);
    //     expect(result[0][0]).toBe('0x751bdD89dDD33849507334d9C802a15aAE05D826');
    //     expect(Web3.utils.toAscii(result[1][0]).includes('BBB1')).toBe(true);


    // });

    // test('should revoke Access', async () => {
    //     const result = await interaction.acccessInteraction.revokeAccess('BBB1', 'AAA2', '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6', interaction.identity);
    //     expect(result.includes('0x')).toBe(true);
    // });


    // test('should not give and revoke access (empty resource)', async () => {
    //     try {
    //         const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //         const result = await interaction.acccessInteraction.giveAccess('', 'AAA2', account, interaction.identity);
    //         expect(result.includes('0x')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The resource must have at least one character');
    //     }
    //     try {
    //         const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //         const result = await interaction.acccessInteraction.revokeAccess('', 'AAA2', account, interaction.identity);
    //         expect(result.includes('0x')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The resource must have at least one character');
    //     }
    // });
    // test('should not give and revoke access (empty consentID)', async () => {
    //     try {
    //         const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //         const result = await interaction.acccessInteraction.giveAccess('BBB1', '', account, interaction.identity);
    //         expect(result.includes('0x')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The consentID must have at least one character');
    //     }
    //     try {
    //         const account = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //         const result = await interaction.acccessInteraction.revokeAccess('BBB1', '', account, interaction.identity);
    //         expect(result.includes('0x')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The consentID must have at least one character');

    //     }
    // });
    // test('should not give and revoke access (empty account)', async () => {
    //     try {
    //         const account = '';
    //         const result = await interaction.acccessInteraction.giveAccess('BBB1', 'AAA2', account, interaction.identity);
    //         expect(result.includes('0x')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The account must have at least one character');
    //     }
    //     try {
    //         const account = '';
    //         const result = await interaction.acccessInteraction.revokeAccess('BBB1', 'AAA2', account, interaction.identity);
    //         expect(result.includes('0x')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The account must have at least one character');
    //     }
    // });
    // test('should not give and revoke access (invalid account)', async () => {
    //     try {
    //         const account = 'invalid account';
    //         const result = await interaction.acccessInteraction.giveAccess('BBB1', 'AAA2', account, interaction.identity);
    //         expect(result.includes('0x')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The account format is invalid');
    //     }
    //     try {
    //         const account = 'invalid account';
    //         const result = await interaction.acccessInteraction.revokeAccess('BBB1', 'AAA2', account, interaction.identity);
    //         expect(result.includes('0x')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The account format is invalid');

    //     }
    // });

    // test('should not check access (empty resource)', async () => {
    //     try {
    //         const interactionX = { ...interaction };
    //         interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //         const result = await interaction.acccessInteraction.checkAccess('', 'AAA2', interactionX.identity);
    //         expect(result).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The resource must have at least one character');

    //     }
    // });
    // test('should not check access (empty consentID)', async () => {
    //     try {
    //         const interactionX = { ...interaction };
    //         interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //         const result = await interaction.acccessInteraction.checkAccess('BBB1', '', interactionX.identity);
    //         expect(result).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The consentID must have at least one character');

    //     }
    // });

    // test('should not get resource by consent (empty consentID)', async () => {
    //     try {
    //         const interactionX = { ...interaction };
    //         interactionX.identity.address = '0xbB230b6210C5E4640Cf7d3dC306Cdc5a207C92a6';
    //         const result = await interaction.acccessInteraction.getResourceByConsent('', interactionX.identity);
    //         expect(result[0][0]).toBe('0x751bdD89dDD33849507334d9C802a15aAE05D826');
    //         expect(Web3.utils.toAscii(result[1][0]).includes('BBB1')).toBe(true);
    //     } catch (error) {
    //         expect(error).toBeInstanceOf(Error);
    //         expect(error.message).toBe('The consentID must have at least one character');

    //     }
    // });


    // test('should cancel consent', async () => {
    //     await interaction.consentInteraction.cancelConsent('AAA2', interaction.identity);

    // });


});