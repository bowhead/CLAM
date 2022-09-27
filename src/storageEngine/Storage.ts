import IStorageEngine from './IStorageEngine';
//eslint-disable-next-line @typescript-eslint/no-unused-vars
import { injectable, inject } from 'tsyringe';

/**
 * Storage to save, update, get and delete files from specific engine.
 * You can inject your preferred storage engine.
 */
@injectable()
class Storage {
    /**
     * Inject implementation
     * @param {IStorageEngine} engine - Storage engine implementation 
     */
    constructor(@inject('Engine') private engine: IStorageEngine) {}

    /**
     * Set storage engine configurations
     * @param {object} options - Configuration options
     */
    setConfiguration(options: object): void {
        this.engine.setConfiguration(options);
    }

    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     */
    async saveFile(options: object): Promise<string> {
        return await this.engine.saveFile(options);
    }

    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file
     */
    async getFile(options: object): Promise<string> {
        return await this.engine.getFile(options);
    }
    
    /**
     * Update file stored
     * @param {object} options - File identifier or location and additional parameters
     */
    async updateFile(options: object): Promise<void> {
        await this.engine.updateFile(options);
    }

    /**
     * Delete file from storage engine
     * @param {object} options - Identifier of the file to delete and additional parameters
     */
    async deleteFile(options: object): Promise<void> {
        await this.engine.deleteFile(options);
    }
}

export default Storage;