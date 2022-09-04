import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
import Web3Provider from '../src/contractIntegration/interaction/Web3Provider';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import Web3 from 'web3';
import { IContractConfig } from '../src/contractIntegration/interaction/types/IContractConfig';
import { AbiItem } from 'web3-utils';

describe('Testing IPFS management interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let web3Provider: Web3Provider;
    let interaction: Interaction;

    const salt = (Math.random() + 1).toString(36).substring(7);
    const fileHash = `bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi${salt}.txt`;
    const fileName = 'text.txt';

    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        web3Provider = Web3Provider.getInstance();


        const web3 = new Web3('http://localhost:8545');
        const consentConfig:IContractConfig = { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent.abi as unknown as AbiItem};
        const accessConfig:IContractConfig = { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess.abi as unknown as AbiItem};
        const consentResourceConfig:IContractConfig = { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412', abi: ABIConsentResource.abi as unknown as AbiItem};
        const IPFSManagementConfig:IContractConfig = { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement.abi as unknown as AbiItem};
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');
        const identity: IdentityManager = factoryIdentity.generateIdentity('AES', 'PGP');

        identity.address = '0x8B3921DA1090CF8de6a34dcb929Be0df53AB81Fa';
        identity.privateKey = '0a6a24eac9cd5adf1d4b447fdc3316623d362480d6a835da70860b4d4cb0f82f';

        interaction.setIdentity(identity);
    });

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
            expect((error as Error).message).toBe('Returned error: VM Exception while processing transaction: revert File already registered');
        }
    });

    test('Should fail if try to check of file is available without upload it yet', async() => {
        try {
            await interaction.IPFSManagementInteraction.fileIsAvailable(fileHash+'2', interaction.identity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe('Returned error: VM Exception while processing transaction: revert File does not exist');
        }
    });

    test('Should not delete file if the user do not own it', async() => {
        const secondIdentity: IdentityManager = factoryIdentity.generateIdentity('AES', 'PGP');
        secondIdentity.generateIdentity();
        secondIdentity.address = '0x93120bA8FBb9eF2f6744C7d50803A4390E4eF961';

        try {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, secondIdentity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe('Returned error: VM Exception while processing transaction: revert File does not exist');
        }
    });

    test('Should delete file', async() => {
        try {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, interaction.identity);

            await interaction.IPFSManagementInteraction.checkAccess(fileHash, interaction.identity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe('Returned error: VM Exception while processing transaction: revert File already deleted');
        }
    });

    test('Should not delete the same file twice', async() => {
        try {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, interaction.identity);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe('Returned error: VM Exception while processing transaction: revert File already deleted');
        }
    });

    test('Should get all file added by user', async() => {
        const files = await interaction.IPFSManagementInteraction.getFiles(interaction.identity);

        expect(files[0].length).toBeGreaterThan(0);
    });
});