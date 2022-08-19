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
// import nock from "nock";

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

    test('Should add new encrypted file', async () => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
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

    // test('Should update an encrypted file', async() => {
    //     const options = {
    //         file: fs.createReadStream(path.resolve(__dirname, './resources/testUpdate.txt')),
    //         cid: cid
    //     };

    //     nock('http://localhost:3000')
    //         .get('/challenge')
    //         .query({ address: aesInstance.address })
    //         .reply(200, {
    //             'hash': '71baf499ea88cf4c4cf06b9480e48ffae11e987e49f0d6a6c7061f4f02a4b0d2'
    //         });

    //     nock('http://localhost:3000')
    //         .put('/file')
    //         .reply(200);

    //     await documentSharing.updateFile(aesInstance, options);
        
    //     const getOptions = {
    //         cid: cid
    //     };

    //     nock('http://localhost:3000')
    //         .get('/file')
    //         .query({ address: aesInstance.address, cid: cid })
    //         .reply(200, {
    //             file: 'dGVzdHYxMQ=='
    //         });

    //     const file = await documentSharing.getFile(aesInstance, getOptions);

    //     expect(Buffer.from(file, 'base64').toString()).toBe('');
    // })

    test('Should shared an encrypted file if the consent is approved', async () => {
        firstUser = await keysGeneratos.generateKeys({ name: 'first', email: 'first@email.com' });

        const pgpKeys = `${pgpInstanceToShare.publicKeySpecial},${firstUser.publicKey}`;

        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
        }

        cidShared = await documentSharing.sharedFile(pgpInstance, options, pgpKeys);

        expect(cidShared).not.toBe('');

        const getOptions = {
            cid: cidShared,
            owner: pgpInstance.address
        }

        const file = await documentSharing.getSharedFile(pgpInstance, getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should get shared file if user is added on list to shared', async () => {
        const options = {
            cid: cidShared,
            owner: pgpInstance.address
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
                owner: pgpInstance.address
            };

            await documentSharing.getSharedFile(instance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Error decrypting message: Session key decryption failed.');
        }
    });

    test('Should not shared an encrypted file if the consent is not approved', async () => {
        try {
            firstUser = await keysGeneratos.generateKeys({ name: 'first', email: 'first@email.com' });

            const pgpKeys = `${pgpInstanceToShare.publicKeySpecial},${firstUser.publicKey}`;

            const options = {
                file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
                fileName: 'test.txt',
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
});
