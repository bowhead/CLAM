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
import { FactoryInteraction ,Interaction } from '../src/contractIntegration';

describe('User owned file flow', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();

    const aesInstance: IdentityManager = factoryIdentity.generateIdentity('aes', 'pgp');
    aesInstance.generateIdentity();
    const storageEngine: IStorageEngine = new StorageEngine({
        URL: 'http://localhost:3000',
        ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
        timeout: 2000
    })
    const documentSharing = new DocumentSharing(storageEngine);

    let cid: string;
    let web3Provider: Web3Provider;
    let interaction: Interaction;
    let factoryInteraction: FactoryInteraction;

    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        web3Provider = Web3Provider.getInstance();

        const urlProvider = 'http://localhost:8545';
        const consentConfig = { address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', abi: ABIConsent.abi };
        const accessConfig = { address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', abi: ABIConsentResource.abi };
        const IPFSManagementConfig = { address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', abi: ABIIPFSManagement.abi };
        web3Provider.setConfig(urlProvider, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        aesInstance.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        aesInstance.privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

        interaction.setIdentity(aesInstance);
    })

    test('Should approve consent, add new encrypted file and save register on IPFS Management contract', async () => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1'
        };

        let consentApproved = await interaction.consentInteraction.getConsentById(options.consentId, aesInstance.address, aesInstance);

        if (!consentApproved) {
            await interaction.consentInteraction.saveConsent(options.consentId, aesInstance);
        }
             
        cid = await documentSharing.saveFile(aesInstance, options);

        expect(cid).not.toBe('');

        await interaction.IPFSManagementInteraction.addFile(cid, options.fileName, aesInstance);
    });

    test('Should not add new encrypted file if the consent is not approved', async() => {
        try {
            const options = {
                file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
                fileName: 'test.txt',
                contractInteraction: interaction,
                consentId: 'AAA2'
            };
                 
            await documentSharing.saveFile(aesInstance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'Consent not registered'`);          
        }
    });

    test('Should check if file is registered on IPFS management contract and get unencrypted file', async() => {
        let fileExists = await interaction.IPFSManagementInteraction.fileIsAvailable(cid, aesInstance);

        expect(fileExists).toBe(true);

        const options = {
            cid: cid
        }

        const file = await documentSharing.getFile(aesInstance, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should not get an encrypted file when the identity does not own the file', async () => {
        try {
            const secondIdentity: IdentityManager = factoryIdentity.generateIdentity('aes', 'pgp');
            secondIdentity.generateIdentity();
            secondIdentity.address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

            let fileExists = await interaction.IPFSManagementInteraction.fileIsAvailable(cid, aesInstance);

            expect(fileExists).toBe(true);

            const options = {
                cid: cid
            }
            
            await documentSharing.getFile(aesInstance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'File does not exist'`);
        }
    })
});

describe('User sharing files flow', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();

    const pgpInstance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
    pgpInstance.generateIdentity();

    const pgpInstanceToShare: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
    pgpInstanceToShare.generateIdentity();

    const pgpInstanceNotShare: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
    pgpInstanceNotShare.generateIdentity();

    const storageEngine: IStorageEngine = new StorageEngine({
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
        factoryInteraction = new FactoryInteraction();
        web3Provider = Web3Provider.getInstance();

        const urlProvider = 'http://localhost:8545';
        const consentConfig = { address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', abi: ABIConsent.abi };
        const accessConfig = { address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', abi: ABIConsentResource.abi };
        const IPFSManagementConfig = { address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6', abi: ABIIPFSManagement.abi };
        web3Provider.setConfig(urlProvider, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        pgpInstance.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        pgpInstance.privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

        pgpInstanceToShare.address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
        pgpInstanceToShare.privateKey = '59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

        interaction.setIdentity(pgpInstance);
    });

    test(`Should approve consent,
        add users allowed to get shared file,
        add new encrypted shared file,
        save register on IPFS management contract 
        and add user accounts allowed on access contract`, async () => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'SHARED'
        };

        try {
            let consentApproved = await interaction.consentInteraction.getConsentById(options.consentId, pgpInstance.address, pgpInstance);

            if (!consentApproved) {
                await interaction.consentInteraction.saveConsent(options.consentId, pgpInstance);
            }
        } catch (error) {
            await interaction.consentInteraction.saveConsent(options.consentId, pgpInstance);
        }

        await interaction.consentInteraction.addKey(options.consentId, pgpInstanceToShare.address, pgpInstanceToShare.publicKeySpecial, pgpInstance);

        const usersToShare = await interaction.consentInteraction.getKeys(options.consentId, pgpInstance);

        const pgpKeys = usersToShare[1].join(',');

        cidShared = await documentSharing.sharedFile(pgpInstance, options, pgpKeys);

        expect(cidShared).not.toBe('');

        await interaction.IPFSManagementInteraction.addFile(cidShared, options.fileName, pgpInstance);

        await interaction.acccessInteraction.giveAccess(cidShared, options.consentId, usersToShare[0], options.fileName, pgpInstance);
    });

    test('Should get shared file if user is added on list to shared', async() => {
        const options = {
            cid: cidShared,
            owner: pgpInstance.address,
            contractInteraction: interaction,
            consentId: 'SHARED'
        }

        const file = await documentSharing.getSharedFile(pgpInstanceToShare, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should not get an encrypted file when the identity does not own the file', async () => {
        try {
            const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
            instance.generateIdentity();

            const options = {
                cid: cidShared,
                owner: pgpInstance.address,
                contractInteraction: interaction,
                consentId: 'SHARED'
            };
            
            await documentSharing.getSharedFile(instance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.data.message).toBe(`Error: VM Exception while processing transaction: reverted with reason string 'You don't have permission over this resource'`);
        }
    });
});