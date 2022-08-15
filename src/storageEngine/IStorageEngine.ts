interface IStorageEngine {
    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {Promise<string>} returns the file identifier or location
     */
    saveFile(options: object): Promise<string>;

    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {Promise<string>} returns the file
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

export default IStorageEngine;
