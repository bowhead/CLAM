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
import Web3 from 'web3';

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

        const web3 = new Web3('http://localhost:8545');
        const consentConfig = { address: '0xb3d94DBF4447152E0353C436bB8CD1Be3Bde0Da1', abi: ABIConsent.abi };
        const accessConfig = { address: '0x6302548E0cAfB5977BAB4C1eC6a3BD0aD935A803', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0x8d1d6a876C175442169e2a58817667DAaD14Da94', abi: ABIConsentResource.abi };
        const IPFSManagementConfig = { address: '0x5c349c327CEBC32d6aEa22bC216b6a75A0044Eb1', abi: ABIIPFSManagement.abi };
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        aesInstance.address = '0x5B484242c0bc825CDBeeEFa6c05A22C309D62a80';
        aesInstance.privateKey = '371f17889223d5038fccd4de66a5d2397d31be260ae29121d611418354dc7831';

        interaction.setIdentity(aesInstance);
    })

    test('Should approve consent, add new encrypted file and save register on IPFS Management contract', async () => {
        const options = {
            file: await fs.promises.readFile(path.resolve(__dirname, './resources/test.txt'), 'base64'),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1',
            keepOriginalName: false
        };

        try {
            let consentApproved = await interaction.consentInteraction.getConsentById(options.consentId, aesInstance.address, aesInstance);

            if (!consentApproved) {
                await interaction.consentInteraction.saveConsent(options.consentId, aesInstance);
            }
        } catch (error) {
            await interaction.consentInteraction.saveConsent(options.consentId, aesInstance);
        }

        cid = await documentSharing.saveFile(aesInstance, options);

        expect(cid).not.toBe('');

        await interaction.IPFSManagementInteraction.addFile(cid, options.fileName, aesInstance);
    });

    test('Should not add new encrypted file if the consent is not approved', async() => {
        try {
            const options = {
                file: await fs.promises.readFile(path.resolve(__dirname, './resources/test.txt'), 'base64'),
                fileName: 'test.txt',
                contractInteraction: interaction,
                consentId: 'AAA2'
            };
                 
            await documentSharing.saveFile(aesInstance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toContain('Consent not registered');
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

    const pgpSecondInstanceToShare: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
    pgpSecondInstanceToShare.generateIdentity();

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
        jest.setTimeout(10000);
        factoryInteraction = new FactoryInteraction();
        web3Provider = Web3Provider.getInstance();

        const web3 = new Web3('http://localhost:8545');
        const consentConfig = { address: '0xb3d94DBF4447152E0353C436bB8CD1Be3Bde0Da1', abi: ABIConsent.abi };
        const accessConfig = { address: '0x6302548E0cAfB5977BAB4C1eC6a3BD0aD935A803', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0x8d1d6a876C175442169e2a58817667DAaD14Da94', abi: ABIConsentResource.abi };
        const IPFSManagementConfig = { address: '0x5c349c327CEBC32d6aEa22bC216b6a75A0044Eb1', abi: ABIIPFSManagement.abi };
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        pgpInstance.address = '0x5B484242c0bc825CDBeeEFa6c05A22C309D62a80';
        pgpInstance.privateKey = '371f17889223d5038fccd4de66a5d2397d31be260ae29121d611418354dc7831';

        pgpInstanceToShare.address = '0x934824993588a4dC2374C0Bf6Bc5c3bfa1E4A640';
        pgpInstanceToShare.privateKey = 'ea2deac685d589a2dbf1e130196c957eb5f11c6f615c17cddb25cd58dbbab850';

        pgpSecondInstanceToShare.address = '0x18148c5e87FB6f79029836901F97bb3dEdc9bCeC';
        pgpSecondInstanceToShare.privateKey = '75c5eb65866d7461b6c2379443c6f865ffac1217ec8902e7095ed4c139a2fa55';

        interaction.setIdentity(pgpInstance);
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
            expect(error.message).toContain(`You don't have permission over this resource`);
        }
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
            let consentApproved = await interaction.consentInteraction.getConsentById(options.consentId, pgpInstance.address, pgpInstance);

            if (!consentApproved) {
                await interaction.consentInteraction.saveConsent(options.consentId, pgpInstance);
            }
        } catch (error) {
            await interaction.consentInteraction.saveConsent(options.consentId, pgpInstance);
        }

        await interaction.consentInteraction.addKey(options.consentId, pgpInstanceToShare.address, pgpInstanceToShare.publicKeySpecial, pgpInstance);

        await interaction.consentInteraction.addKey(options.consentId, pgpSecondInstanceToShare.address, pgpSecondInstanceToShare.publicKeySpecial, pgpInstance);

        const usersToShare = await interaction.consentInteraction.getKeys(options.consentId, pgpInstance);

        const pgpKeys = usersToShare[1].join(',');

        cidShared = await documentSharing.sharedFile(pgpInstance, options, pgpKeys);

        expect(cidShared).not.toBe('');

        await interaction.IPFSManagementInteraction.addFile(cidShared, options.fileName, pgpInstance);

        await interaction.acccessInteraction.giveAccess(cidShared, options.consentId, usersToShare[0], options.fileName, pgpInstance);

        const getOptions = {
            cid: cidShared,
            owner: pgpInstance.address,
            contractInteraction: interaction,
            consentId: 'SHARED1'
        }

        const fileShared1 = await documentSharing.getSharedFile(pgpInstanceToShare, getOptions);

        expect(Buffer.from(fileShared1, 'base64').toString()).toBe('testv10');

        const fileShared2 = await documentSharing.getSharedFile(pgpSecondInstanceToShare, getOptions);

        expect(Buffer.from(fileShared2, 'base64').toString()).toBe('testv10');
    });
});