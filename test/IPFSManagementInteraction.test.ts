import { FactoryInteraction, Interaction } from "../src/contractIntegration";
import { FactoryIdentity, IdentityManager } from '../src/';
import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';
import * as crypto from 'crypto';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import Web3 from 'web3';

describe('Testing IPFS management interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;

    const salt = crypto.randomUUID();
    const fileHash = `bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi${salt}.txt`;
    const fileName = 'text.txt';

    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();


        const web3 = new Web3('http://localhost:8545');
        const consentConfig = { address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', abi: ABIConsent.abi };
        const accessConfig = { address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', abi: ABIConsentResource.abi };
        const IPFSManagementConfig = { address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', abi: ABIIPFSManagement.abi };
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');
        const identity: IdentityManager = factoryIdentity.generateIdentity('aes', 'pgp');

        identity.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        identity.privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

        interaction.setIdentity(identity);
    })

    test('Should add file and check if the file is available', async() => {
        await interaction.IPFSManagementInteraction.addFile(fileHash, fileName, interaction.identity);

        const fileExist = await interaction.IPFSManagementInteraction.fileIsAvailable(fileHash, interaction.identity);

        expect(fileExist).toBe(true);
    });

    test('Should not add the same file twice', async() => {
        try {
            await interaction.IPFSManagementInteraction.addFile(fileHash, fileName, interaction.identity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'File already registered'`);
        }
    });

    test('Should fail if try to check of file is available without upload it yet', async() => {
        try {
            await interaction.IPFSManagementInteraction.fileIsAvailable(fileHash+'2', interaction.identity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'File does not exist'`);
        }
    });

    test('Should not delete file if the user do not own it', async() => {
        const secondIdentity: IdentityManager = factoryIdentity.generateIdentity('aes', 'pgp');
        secondIdentity.generateIdentity();
        secondIdentity.address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

        try {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, secondIdentity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'File does not exist'`);
        }
    });

    test('Should delete file', async() => {
        try {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, interaction.identity);

            await interaction.IPFSManagementInteraction.checkAccess(fileHash, interaction.identity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'File already deleted'`);
        }
    });

    test('Should not delete the same file twice', async() => {
        try {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, interaction.identity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'File already deleted'`);
        }
    });

    test('Should get all file added by user', async() => {
        const files = await interaction.IPFSManagementInteraction.getFiles(interaction.identity);

        expect(files[0].length).toBeGreaterThan(0);
    });
})