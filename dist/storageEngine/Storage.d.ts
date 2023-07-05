import IStorageEngine from './IStorageEngine';
/**
 * Storage to save, update, get and delete files from specific engine.
 * You can inject your preferred storage engine.
 */
declare class Storage {
    private engine;
    /**
     * Inject implementation
     * @param {IStorageEngine} engine - Storage engine implementation
     */
    constructor(engine: IStorageEngine);
    /**
     * Set storage engine configurations
     * @param {object} options - Configuration options
     */
    setConfiguration(options: object): void;
    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     */
    saveFile(options: object): Promise<string>;
    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file
     */
    getFile(options: object): Promise<string>;
    /**
     * Update file stored
     * @param {object} options - File identifier or location and additional parameters
     */
    updateFile(options: object): Promise<void>;
    /**
     * Delete file from storage engine
     * @param {object} options - Identifier of the file to delete and additional parameters
     */
    deleteFile(options: object): Promise<void>;
}
export default Storage;
