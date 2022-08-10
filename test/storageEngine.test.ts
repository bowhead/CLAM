import { StorageEngine, IStorageEngine } from "../src";
import * as fs from 'fs';
import path from 'path';
import IPFSManagement from './utils/IPFSManagementHelper';

describe('Testing storage engine using IPFS service as default', () => {
    const storageEngine : IStorageEngine = new StorageEngine({
        URL: 'http://localhost:3000',
        ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM='
    })
    const ipfsManagement = new IPFSManagement('IPFSManagement', '0x57BCD4edE564B699eAA9e8A758628a5B295DC1eB', '0x7EEc887Ff77e28D7Cbd2057E1da4251F48B81336', 'bebefc9fd249df72a5b010e92adac9353ea11cc5825e5c710ef2da831e948c74');
    let cid: string;
    const address = '0x7EEc887Ff77e28D7Cbd2057E1da4251F48B81336';
    const privateKey = 'bebefc9fd249df72a5b010e92adac9353ea11cc5825e5c710ef2da831e948c74'

    test('Should add new file', async () => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            address: address,
            fileName: 'test.txt'
        };

        cid = await storageEngine.saveFile(options)

        await ipfsManagement.addFile(cid, options.fileName);

        expect(cid).not.toBe('')
    })

    test('Should get file by CID', async () => {
        const options = {
            address: address,
            cid: cid
        }

        const file = await storageEngine.getFile(options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10')
    })

    test('Should update file by CID', async () => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/testUpdate.txt')),
            address: address,
            cid: cid,
            privateKey: privateKey
        };

        await storageEngine.updateFile(options);

        const getOptions = {
            address: address,
            cid: cid
        }

        const file = await storageEngine.getFile(getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv11')
    });

    test('Should delete file by CID', async () => {
        const options = {
            address: address,
            cid: cid,
            privateKey: privateKey
        }

        await storageEngine.deleteFile(options);

        const getOptions = {
            address: address,
            cid: cid
        }

        const file = await storageEngine.getFile(getOptions);

        expect(file).toBe('');
    });

    test('Should not update file when the file not exist', async () => {
        try {
            const options = {
                file: fs.createReadStream(path.resolve(__dirname, './resources/testUpdate.txt')),
                address: address,
                cid: cid,
                privateKey: privateKey
            };
    
            await storageEngine.updateFile(options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("File not found");
        }
    });

    test('Should not delete file when the file not exist', async () => {
        try {
            const options = {
                address: address,
                cid: cid,
                privateKey: privateKey
            }
    
            await storageEngine.deleteFile(options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("File not found");
        }
    });
});
