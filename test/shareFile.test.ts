import {
    DocumentSharing,
    IdentityManager,
    FactoryIdentity,
    IStorageEngine,
    StorageEngine
} from '../src';
import * as fs from 'fs';
import path from 'path';
import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/ConsentResource.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';
import { FactoryInteraction, Interaction } from '../src/contractIntegration';
import Web3 from 'web3';
import IInteractionConfig from '../src/contractIntegration/interaction/IInteractionConfig';
import FactoryWeb3Interaction from '../src/contractIntegration/interaction/web3Provider/FactoryWeb3Interaction';

describe('User owned file flow', () => {
    let factoryIdentity = new FactoryIdentity();
    const AESInstance: IdentityManager = factoryIdentity.generateIdentity('AES', 'PGP');
    AESInstance.generateIdentity();
    
    const storageEngineFactory = new StorageEngine();
    const storageEngine = storageEngineFactory.getStorageEngine();
    storageEngine.setConfiguration({
        URL: 'http://localhost:3000',
        ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
        timeout: 2000
    });
    
    const documentSharing = new DocumentSharing(storageEngine);
    let cid: string;
    let factoryInteraction: FactoryInteraction;
    let factoryWeb3Provider: FactoryWeb3Interaction;
    let interaction: Interaction;

    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        factoryWeb3Provider = FactoryWeb3Interaction.getInstance();

        const interactionConfig: IInteractionConfig = {
            provider: String(process.env.CLAM_BLOCKCHAIN_LOCALTION),
            chainId: 13,
            consent: { address: String(process.env.CLAM_CONSENT_ADDRESS), abi: ABIConsent.abi },
            access: { address: String(process.env.CLAM_ACCESS_ADDRESS), abi: ABIAccess.abi },
            consentResource: { address: String(process.env.CLAM_CONSENT_RESOURCE_ADDRESS), abi: ABIConsentResource.abi },
            ipfs: { address: String(process.env.CLAM_IPFS_ADDRESS), abi: ABIIPFSManagement.abi }
        }
        factoryWeb3Provider.setConfig(interactionConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        AESInstance.address = '0x8B3921DA1090CF8de6a34dcb929Be0df53AB81Fa';
        AESInstance.privateKey = '0a6a24eac9cd5adf1d4b447fdc3316623d362480d6a835da70860b4d4cb0f82f';

        interaction.setIdentity(AESInstance);
    });

    test('Should approve consent, add new encrypted file and save register on IPFS Management contract', async () => {
        const options = {
            file: await fs.promises.readFile(path.resolve(__dirname, './resources/test.txt'), 'base64'),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1',
            keepOriginalName: false
        };

        try {
            const consentApproved = await interaction.consentInteraction.getConsentById(options.consentId, AESInstance.address, AESInstance);

            if (!consentApproved) {
                await interaction.consentInteraction.saveConsent(options.consentId, AESInstance);
            }
        } catch (error) {
            await interaction.consentInteraction.saveConsent(options.consentId, AESInstance);
        }

        cid = await documentSharing.saveFile(AESInstance, options);

        expect(cid).not.toBe('');

        await interaction.IPFSManagementInteraction.addFile(cid, options.fileName, AESInstance);
    });

    test('Should not add new encrypted file if the consent is not approved', async () => {
        const options = {
            file: await fs.promises.readFile(path.resolve(__dirname, './resources/test.txt'), 'base64'),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA2'
        };

        await expect(documentSharing.saveFile(AESInstance, options)).rejects.toThrow('Consent not registered');
    });

    test('Should check if file is registered on IPFS management contract and get decrypted file', async () => {
        const fileExists = await interaction.IPFSManagementInteraction.fileIsAvailable(cid, AESInstance);

        expect(fileExists).toBe(true);

        const options = {
            cid: cid
        };

        const file = await documentSharing.getFile(AESInstance, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testV10');
    });

    test('Should not get an encrypted file when the identity does not own the file', async () => {
        const secondIdentity: IdentityManager = factoryIdentity.generateIdentity('AES', 'PGP');
        secondIdentity.generateIdentity();
        secondIdentity.address = '0x93120bA8FBb9eF2f6744C7d50803A4390E4eF961';

        const fileExists = await interaction.IPFSManagementInteraction.fileIsAvailable(cid, AESInstance);

        expect(fileExists).toBe(true);

        const options = {
            cid: cid
        };

        await expect(documentSharing.getFile(secondIdentity, options)).rejects.toThrow('Request failed with status code 404');
    });
});

describe('User sharing files flow', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();

    const PGPInstance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
    PGPInstance.generateIdentity();

    const PGPInstanceToShare: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
    PGPInstanceToShare.generateIdentity();

    const PGPSecondInstanceToShare: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
    PGPSecondInstanceToShare.generateIdentity();
 
    const storageEngineFactory = new StorageEngine();
    const storageEngine = storageEngineFactory.getStorageEngine();
    storageEngine.setConfiguration({
        URL: 'http://localhost:3000',
        ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
        timeout: 2000
    });
    
    const documentSharing = new DocumentSharing(storageEngine);
    let cidShared: string;
    let factoryInteraction: FactoryInteraction;
    let web3Provider: Web3Provider;
    let interaction: Interaction;

    beforeEach(() => {
        jest.setTimeout(10000);
        factoryInteraction = new FactoryInteraction();
        web3Provider = Web3Provider.getInstance();

        const interactionConfig: IInteractionConfig = {
            provider: String(process.env.CLAM_BLOCKCHAIN_LOCALTION),
            consent: { address: String(process.env.CLAM_CONSENT_ADDRESS), abi: ABIConsent.abi },
            access: { address: String(process.env.CLAM_ACCESS_ADDRESS), abi: ABIAccess.abi },
            consentResource: { address: String(process.env.CLAM_CONSENT_RESOURCE_ADDRESS), abi: ABIConsentResource.abi },
            ipfs: { address: String(process.env.CLAM_IPFS_ADDRESS), abi: ABIIPFSManagement.abi }
        }

        const web3 = new Web3(interactionConfig.provider);
        web3Provider.setConfig(web3,interactionConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        PGPInstance.address = '0x8B3921DA1090CF8de6a34dcb929Be0df53AB81Fa';
        PGPInstance.privateKey = '0a6a24eac9cd5adf1d4b447fdc3316623d362480d6a835da70860b4d4cb0f82f';

        PGPInstanceToShare.address = '0x93120bA8FBb9eF2f6744C7d50803A4390E4eF961';
        PGPInstanceToShare.privateKey = '41582c42e41141d40b2e42ec53252a4f31a849758a115df2b8eb94fc1abfcc54';

        PGPSecondInstanceToShare.address = '0x6042bc18e1EeF555Ce703Bbcfe82cA4FBE0e569c';
        PGPSecondInstanceToShare.privateKey = '7a89bdee51c2dd476de56ab9d03faf6a62526b1e94859f601f5cbbd6b8817cd4';

        interaction.setIdentity(PGPInstance);
    });

    test(`Should approve consent,
        add users allowed to get shared file,
        add new encrypted shared file,
        save register on IPFS management contract 
        and add user accounts allowed on access contract`, async () => {
        const options = {
            file: await fs.promises.readFile(path.resolve(__dirname, './resources/test.txt'), 'base64'),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'SHARED',
            keepOriginalName: false
        };

        try {
            const consentApproved = await interaction.consentInteraction.getConsentById(options.consentId, PGPInstance.address, PGPInstance);

            if (!consentApproved) {
                await interaction.consentInteraction.saveConsent(options.consentId, PGPInstance);
            }
        } catch (error) {
            await interaction.consentInteraction.saveConsent(options.consentId, PGPInstance);
        }

        await interaction.consentInteraction.addKey(options.consentId, PGPInstanceToShare.address, PGPInstanceToShare.publicKeySpecial, PGPInstance);

        const usersToShare = await interaction.consentInteraction.getKeys(options.consentId, PGPInstance);

        const PGPKeys = usersToShare[1].join(',');

        cidShared = await documentSharing.sharedFile(PGPInstance, options, PGPKeys);

        expect(cidShared).not.toBe('');

        await interaction.IPFSManagementInteraction.addFile(cidShared, options.fileName, PGPInstance);

        await interaction.accessInteraction.giveAccess(cidShared, options.consentId, usersToShare[0], options.fileName, PGPInstance);
    });

    test('Should get shared file if user is added on list to shared', async () => {
        const options = {
            cid: cidShared,
            owner: PGPInstance.address,
            contractInteraction: interaction,
            consentId: 'SHARED'
        };

        const file = await documentSharing.getSharedFile(PGPInstanceToShare, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testV10');
    });

    test('Should not get an encrypted file when the identity does not own the file', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        instance.generateIdentity();

        const options = {
            cid: cidShared,
            owner: PGPInstance.address,
            contractInteraction: interaction,
            consentId: 'SHARED'
        };

        await expect(documentSharing.getSharedFile(instance, options)).rejects.toThrow('You don\'t have permission over this resource');
    });

    test(`Should approve consent,
        add users allowed to get shared file,
        encrypt shared file with multiple keys,
        save register on IPFS management contract 
        add user accounts allowed on access contract
        and decrypt file with different keys`, async () => {
        const options = {
            file: await fs.promises.readFile(path.resolve(__dirname, './resources/test.txt'), 'base64'),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'SHARED1',
            keepOriginalName: false
        };

        try {
            const consentApproved = await interaction.consentInteraction.getConsentById(options.consentId, PGPInstance.address, PGPInstance);

            if (!consentApproved) {
                await interaction.consentInteraction.saveConsent(options.consentId, PGPInstance);
            }
        } catch (error) {
            await interaction.consentInteraction.saveConsent(options.consentId, PGPInstance);
        }

        await interaction.consentInteraction.addKey(options.consentId, PGPInstanceToShare.address, PGPInstanceToShare.publicKeySpecial, PGPInstance);

        await interaction.consentInteraction.addKey(options.consentId, PGPSecondInstanceToShare.address, PGPSecondInstanceToShare.publicKeySpecial, PGPInstance);

        const usersToShare = await interaction.consentInteraction.getKeys(options.consentId, PGPInstance);

        const PGPKeys = usersToShare[1].join(',');

        cidShared = await documentSharing.sharedFile(PGPInstance, options, PGPKeys);

        expect(cidShared).not.toBe('');

        await interaction.IPFSManagementInteraction.addFile(cidShared, options.fileName, PGPInstance);

        await interaction.accessInteraction.giveAccess(cidShared, options.consentId, usersToShare[0], options.fileName, PGPInstance);

        const getOptions = {
            cid: cidShared,
            owner: PGPInstance.address,
            contractInteraction: interaction,
            consentId: 'SHARED1'
        };

        const fileShared1 = await documentSharing.getSharedFile(PGPInstanceToShare, getOptions);

        expect(Buffer.from(fileShared1, 'base64').toString()).toBe('testV10');

        const fileShared2 = await documentSharing.getSharedFile(PGPSecondInstanceToShare, getOptions);

        expect(Buffer.from(fileShared2, 'base64').toString()).toBe('testV10');
    });
});