import { StorageEngine } from '../src';
import * as fs from 'fs';
import path from 'path';
import nock from 'nock';

describe('Testing storage engine using IPFS service as default', () => {
    const storageEngineFactory = new StorageEngine();
    const storageEngine = storageEngineFactory.getStorageEngine();
    storageEngine.setConfiguration({
        URL: 'http://localhost:3000',
        ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
        timeout: 2000
    });

    let cid: string;
    const address = '0x7EEc887Ff77e28D7Cbd2057E1da4251F48B81336';
    const privateKey = 'bebefc9fd249df72a5b010e92adac9353ea11cc5825e5c710ef2da831e948c74';
    test('Should add new file', async () => {
        nock('http://localhost:3000')
            .post('/file')
            .reply(200, {
                CID: 'fe5c3e7fa0f43b8cbfed5e69c9a19c722c1900ff893ce7fa6b40646b88e46f48.txt'
            });
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            address: address,
            fileName: 'test.txt'
        };
        cid = await storageEngine.saveFile(options);

        expect(cid).not.toBe('');
    });

    test('Should get file by CID', async () => {
        const options = {
            address: address,
            cid: cid
        };
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: address, cid: cid })
            .reply(200, {
                file: 'dGVzdFYxMA=='
            });
        const file = await storageEngine.getFile(options);
        expect(Buffer.from(file, 'base64').toString()).toBe('testV10');
    });

    test('Should update file by CID', async () => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/testUpdate.txt')),
            address: address,
            cid: cid,
            privateKey: privateKey
        };
        nock('http://localhost:3000')
            .get('/challenge')
            .query({ address: address })
            .reply(200, {
                'hash': '71baf499ea88cf4c4cf06b9480e48ffae11e987e49f0d6a6c7061f4f02a4b0d2'
            });
        nock('http://localhost:3000')
            .put('/file')
            .reply(200);

        await storageEngine.updateFile(options);
        const getOptions = {
            address: address,
            cid: cid
        };
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: address, cid: cid })
            .reply(200, {
                file: 'dGVzdFYxMQ=='
            });
        const file = await storageEngine.getFile(getOptions);
        expect(Buffer.from(file, 'base64').toString()).toBe('testV11');
    });

    test('Should delete file by CID', async () => {
        const options = {
            address: address,
            cid: cid,
            privateKey: privateKey
        };
        nock('http://localhost:3000')
            .get('/challenge')
            .query({ address: address })
            .reply(200, {
                'hash': '71baf499ea88cf4c4cf06b9480e48ffae11e987e49f0d6a6c7061f4f02a4b0d2'
            });
        nock('http://localhost:3000')
            .delete('/file')
            .reply(200);
        await storageEngine.deleteFile(options);
        const getOptions = {
            address: address,
            cid: cid
        };
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: address, cid: cid })
            .reply(200, {
                file: ''
            });

        const file = await storageEngine.getFile(getOptions);
        expect(file).toBe('');
    });

    test('Should not update file when the file not exist', async () => {
        await expect(async () => {
            const options = {
                file: fs.createReadStream(path.resolve(__dirname, './resources/testUpdate.txt')),
                address: address,
                cid: cid,
                privateKey: privateKey
            };
            nock('http://localhost:3000')
                .get('/challenge')
                .query({ address: address })
                .reply(200, {
                    'hash': '71baf499ea88cf4c4cf06b9480e48ffae11e987e49f0d6a6c7061f4f02a4b0d2'
                });
            nock('http://localhost:3000')
                .put('/file')
                .replyWithError({
                    code: 404,
                    message: 'File not found'
                });
            await storageEngine.updateFile(options);
        }).rejects.toThrow('File not found');
    });

    test('Should not delete file when the file not exist', async () => {
        await expect(async () => {
            const options = {
                address: address,
                cid: cid,
                privateKey: privateKey
            };
            nock('http://localhost:3000')
                .get('/challenge')
                .query({ address: address })
                .reply(200, {
                    'hash': '71baf499ea88cf4c4cf06b9480e48ffae11e987e49f0d6a6c7061f4f02a4b0d2'
                });
            nock('http://localhost:3000')
                .delete('/file')
                .replyWithError({
                    code: 404,
                    message: 'File not found'
                });
            await storageEngine.deleteFile(options);
        }).rejects.toThrow('File not found');
    });
});
