import { StorageEngine, IStorageEngine } from '../src';
import * as fs from 'fs';
import path from 'path';

describe('Testing inject new storage engine', () => {
    /**
     * Temporal file type
     */
    class TemporalFile {
        name: string;
        cid: string;
        file: string;
    }

    /**
     * Temporal file search
     */
    class TemporalFileSearch {
        cid: string;
    }


    /**
     * Temporal storage engine
     */
    class TemporalEngine implements IStorageEngine {
        private files = new Array<TemporalFile>;

        /**
         * Save temporal file
         * @param {object} options - File to save and additional parameters
         * @returns {string} returns the file identifier or location
         */
        async saveFile(options: object): Promise<string> {
            const fileInfo = options as TemporalFile;
            const cid = (Math.random() + 1).toString(36).substring(7);
            fileInfo.cid = cid;
            this.files.push(fileInfo);
            return cid;
        }

        /**
         * Get file from storage engine
         * @param {object} options - File identifier or location and additional parameters
         * @returns {string} returns the file
         */
        async getFile(options: object): Promise<string> {
            const fileInfo = options as TemporalFileSearch;
            
            const file = this.files.find(file => {
                return file.cid === fileInfo.cid;
            });

            return file?.file || '';
        }

        /**
         * Update file stored
         * @param {object} options - File identifier or location and additional parameters
         */
        async updateFile(options: object): Promise<void> {
            const fileInfo = options as TemporalFile;

            const index = this.files.findIndex((file => file.cid === fileInfo.cid));

            this.files[index].file = fileInfo.file;
        }

        /**
         * Delete file from storage engine
         * @param {object} options - Identifier of the file to delete and additional parameters
         */
        async deleteFile(options: object): Promise<void> {
            const fileInfo = options as TemporalFileSearch;

            const index = this.files.map(file => file.cid).indexOf(fileInfo.cid);

            this.files.splice(index, 1);
        }

        /**
         * Set storage options
         * @param {object} options - Configuration options
         */
        setConfiguration(options: object): void {
            console.error(options);
        }
    }

    const storageEngineFactory = new StorageEngine(TemporalEngine);
    const storageEngine = storageEngineFactory.getStorageEngine();

    let cid: string;

    test('Should add new file', async () => {
        const options = {
            file: fs.readFileSync(path.resolve(__dirname, './resources/test.txt')).toString('base64'),
            fileName: 'test.txt'
        };

        cid = await storageEngine.saveFile(options);

        expect(cid).not.toBe('');
    });

    test('Should get file by CID', async () => {
        const options = {
            cid: cid
        };

        const file = await storageEngine.getFile(options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testV10');
    });

    test('Should update file by CID', async () => {
        const options = {
            file: fs.readFileSync(path.resolve(__dirname, './resources/testUpdate.txt')).toString('base64'),
            fileName: 'test.txt',
            cid: cid
        };

        await storageEngine.updateFile(options);

        const getOptions = {
            cid: cid
        };

        const file = await storageEngine.getFile(getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testV11');
    });

    test('Should delete file by CID', async () => {
        const options = {
            cid: cid
        };

        await storageEngine.deleteFile(options);

        const getOptions = {
            cid: cid
        };

        const file = await storageEngine.getFile(getOptions);

        expect(file).toBe('');
    });
});
