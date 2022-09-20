import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import { FactoryIdentity, IdentityManager } from '../src/';
//import * as crypto from 'crypto';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/Consent.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import FactoryWeb3Interaction from "../src/contractIntegration/interaction/web3Provider/FactoryWeb3Interaction";
import IInteractionConfig from "../src/contractIntegration/interaction/IInteractionConfig";


describe('Testing IPFS management interaction', () => {
    let factoryInteraction: FactoryInteraction;
    let factoryIdentity: FactoryIdentity;
    let factoryWeb3Provider: FactoryWeb3Interaction;
    let interaction: Interaction;

    const salt = (Math.random() + 1).toString(36).substring(7);
    const fileHash = `bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi${salt}.txt`;
    const fileName = 'text.txt';

    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        factoryIdentity = new FactoryIdentity();
        factoryWeb3Provider = FactoryWeb3Interaction.getInstance();
        const interactionConfig: IInteractionConfig = {
            provider: String(process.env.CLAM_BLOCKCHAIN_LOCALTION),
            consent: { address: String(process.env.CLAM_CONSENT_ADDRESS), abi: ABIConsent.abi },
            access: { address: String(process.env.CLAM_ACCESS_ADDRESS), abi: ABIAccess.abi },
            consentResource: { address: String(process.env.CLAM_CONSENT_RESOURCE_ADDRESS), abi: ABIConsentResource.abi },
            ipfs: { address: String(process.env.CLAM_IPFS_ADDRESS), abi: ABIIPFSManagement.abi }
        }
        factoryWeb3Provider.setConfig(interactionConfig);
        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');
        const identity: IdentityManager = factoryIdentity.generateIdentity('aes', 'pgp');

        identity.address = String(process.env.CLAM_USER_ADDRESS || '');
        identity.privateKey = String(process.env.CLAM_USER_PRIVATEKEY || '');

        interaction.setIdentity(identity);
    });

    test('Should add file and check if the file is available', async () => {
        await interaction.IPFSManagementInteraction.addFile(fileHash, fileName, interaction.identity);
        const fileExist = await interaction.IPFSManagementInteraction.fileIsAvailable(fileHash, interaction.identity);
        expect(fileExist).toBe(true);
    });

    test('Should not add the same file twice', async () => {
        await expect(async () => {
            await interaction.IPFSManagementInteraction.addFile(fileHash, fileName, interaction.identity);
        }).rejects.toThrow(`Returned error: VM Exception while processing transaction: revert File already registered`)
    });

    test('Should fail if try to check of file is available without upload it yet', async () => {
        await expect(async () => {
            await interaction.IPFSManagementInteraction.fileIsAvailable(fileHash + '2', interaction.identity);
        }).rejects.toThrow(`Returned error: VM Exception while processing transaction: revert File does not exist`);

    });

    test('Should not delete file if the user do not own it', async () => {
        const secondIdentity: IdentityManager = factoryIdentity.generateIdentity('AES', 'PGP');
        secondIdentity.generateIdentity();
        secondIdentity.address = '0x93120bA8FBb9eF2f6744C7d50803A4390E4eF961';

        await expect(async () => {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, secondIdentity);
        }).rejects.toThrow(`Returned error: VM Exception while processing transaction: revert File does not exist`);
    });

    test('Should delete file', async () => {
        await expect(async () => {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, interaction.identity);
            await interaction.IPFSManagementInteraction.checkAccess(fileHash, interaction.identity);
        }).rejects.toThrow(`Returned error: VM Exception while processing transaction: revert File already deleted`);
    });

    test('Should not delete the same file twice', async () => {
        await expect(async () => {
            await interaction.IPFSManagementInteraction.removeFile(fileHash, interaction.identity);
        }).rejects.toThrow(`Returned error: VM Exception while processing transaction: revert File already deleted`);
    });

    test('Should get all file added by user', async () => {
        const files = await interaction.IPFSManagementInteraction.getFiles(interaction.identity);
        expect(files[0].length).toBeGreaterThan(0);
    });
});