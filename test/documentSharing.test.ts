import { DocumentSharing, IdentityManager, FactoryIdentity } from "../src";
import * as fs from 'fs';
import path from 'path';
import nock from "nock";

describe('Testing document sharing', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();
    const documentSharing = new DocumentSharing();
    let cid: string;

    test('Should add new encrypted file', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');

        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
        };

        cid = await documentSharing.saveFile(instance, options);

        expect(cid).not.toBe('');
    });

    test('Should get encrypted file', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');

        const options = {
            cid: cid
        }

        const file = await documentSharing.getFile(instance, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should update an encrypted file', async() => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');

        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/testUpdate.txt')),
            cid: cid
        };

        await documentSharing.updateFile(instance, options);

        const getOptions = {
            cid: cid
        };

        const file = await documentSharing.getFile(instance, getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv11');
    })

    test('Should shared an encrypted file if the consent is approved', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
        const researcher = '';

        const options = {
            cid: cid
        }

        await documentSharing.sharedFile(instance, options, researcher);
    });

    test('Should get shared file if the identity is added on list to shared', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');

        const options = {
            cid: cid
        }

        const file = await documentSharing.getSharedFile(instance, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    })

    test('Should not get shared file if the identity is not on list to shared', async () => {
        try {
            const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');

            const options = {
                cid: cid
            }
            
            await documentSharing.getSharedFile(instance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    })

    test('Should not shared an encrypted file if the consent is not approved', async () => {
        try {
            const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
            const researcher = '';

            const options = {
                cid: cid
            }

            await documentSharing.sharedFile(instance, options, researcher);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });

    test('Should not get an encrypted file when the identity does not own the file', async () => {
        try {
            const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');

            const options = {
                cid: cid
            }
            
            await documentSharing.getFile(instance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
        }
    });
});
