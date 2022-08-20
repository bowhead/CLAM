import { 
    DocumentSharing,
    IdentityManager,
    FactoryIdentity,
    IStorageEngine,
    StorageEngine,
    IKeysGenerator,
    KeysGeneratorPGP, 
    IKeys
} from '../src';
import * as fs from 'fs';
import path from 'path';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/ConsentResource.json';
import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';
import { FactoryInteraction ,Interaction } from '../src/contractIntegration';
import nock from "nock";

describe('Testing document sharing', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();
    const keysGeneratos: IKeysGenerator = new KeysGeneratorPGP();

    const aesInstance: IdentityManager = factoryIdentity.generateIdentity('aes', 'pgp');
    aesInstance.generateIdentity();

    const pgpInstance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
    pgpInstance.generateIdentity();

    const pgpInstanceToShare: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
    pgpInstanceToShare.generateIdentity();

    const storageEngine: IStorageEngine = new StorageEngine({
        URL: 'http://localhost:3000',
        ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
        timeout: 2000
    })
    const documentSharing = new DocumentSharing(storageEngine);
    let firstUser : IKeys;
    let cid: string;
    let cidShared: string;
    let factoryInteraction: FactoryInteraction;
    let web3Provider: Web3Provider;
    let interaction: Interaction;

    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        web3Provider = Web3Provider.getInstance();

        const urlProvider = 'http://localhost:8545';
        const consentConfig = { address: '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF', abi: ABIConsent.abi };
        const accessConfig = { address: '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf', abi: ABIConsentResource.abi };
        web3Provider.setConfig(urlProvider, consentConfig, accessConfig, consentResourceConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam');

        aesInstance.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        aesInstance.privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

        pgpInstance.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        pgpInstance.privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

        pgpInstanceToShare.address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
        pgpInstanceToShare.privateKey = '59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';

        interaction.setIdentity(aesInstance);
    });

    test('Should add new encrypted file', async () => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1'
        };
             
        cid = await documentSharing.saveFile(aesInstance, options);

        expect(cid).not.toBe('');
    });

    test('Should get encrypted file', async () => {
        const options = {
            cid: cid
        }

        const file = await documentSharing.getFile(aesInstance, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should update an encrypted file', async() => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/testUpdate.txt')),
            cid: cid
        };

        nock('http://localhost:3000')
            .get('/challenge')
            .query({ address: aesInstance.address })
            .reply(200, {
                'hash': '71baf499ea88cf4c4cf06b9480e48ffae11e987e49f0d6a6c7061f4f02a4b0d2'
            });

        nock('http://localhost:3000')
            .put('/file')
            .reply(200);

        await documentSharing.updateFile(aesInstance, options);
        
        const getOptions = {
            cid: cid
        };

        nock('http://localhost:3000')
            .get('/file')
            .query({ address: aesInstance.address, cid: cid })
            .reply(200, {
                file: 'dGVzdHYxMQ=='
            });

        const file = await documentSharing.getFile(aesInstance, getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('');
    })

    test('Should shared an encrypted file if the consent is approved', async () => {
        firstUser = await keysGeneratos.generateKeys({ name: 'first', email: 'first@email.com' });

        const pgpKeys = `${pgpInstanceToShare.publicKeySpecial},${firstUser.publicKey}`;

        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1'
        }

        cidShared = await documentSharing.sharedFile(pgpInstance, options, pgpKeys);

        expect(cidShared).not.toBe('');

        await interaction.acccessInteraction.giveAccess(cidShared, 'AAA1', [pgpInstanceToShare.address], 'test.txt', pgpInstance);

        const getOptions = {
            cid: cidShared,
            owner: pgpInstance.address,
            contractInteraction: interaction,
            consentId: 'AAA1'
        }

        const file = await documentSharing.getSharedFile(pgpInstance, getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should get shared file if user is added on list to shared', async () => {
        const options = {
            cid: cidShared,
            owner: pgpInstance.address,
            contractInteraction: interaction,
            consentId: 'AAA1'
        }

        const file = await documentSharing.getSharedFile(pgpInstanceToShare, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should not get shared file if the identity is not on list to shared', async () => {
        try {
            const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
            instance.generateIdentity();

            const options = {
                cid: cidShared,
                owner: pgpInstance.address,
                contractInteraction: interaction,
                consentId: 'AAA1'
            };

            await documentSharing.getSharedFile(instance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect([
                `Error decrypting message: Session key decryption failed.`,
                `Returned error: Error: VM Exception while processing transaction: reverted with reason string 'You don't have permission over this resource'`
            ]).toContain(error.message);
        }
    });

    test('Should not shared an encrypted file if the consent is not approved', async () => {
        try {
            firstUser = await keysGeneratos.generateKeys({ name: 'first', email: 'first@email.com' });

            const pgpKeys = `${pgpInstanceToShare.publicKeySpecial},${firstUser.publicKey}`;

            const options = {
                file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
                fileName: 'test.txt',
                contractInteraction: interaction,
                consentId: 'AAA2'
            }

            cidShared = await documentSharing.sharedFile(pgpInstance, options, pgpKeys);

            expect(cidShared).not.toBe('');

            const getOptions = {
                cid: cidShared,
                owner: pgpInstance.address
            }

            await documentSharing.getSharedFile(pgpInstance, getOptions);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'Consent not registered'`);
        }
    });

    test('Should not get an encrypted file when the identity does not own the file', async () => {
        try {
            const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
            instance.generateIdentity();

            const options = {
                cid: cid
            };
            
            await documentSharing.getFile(instance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.response.data.message).toBe('File not found');
        }
    });

    test('Should not add new encrypted file if consent is not approved', async () => {
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
});
