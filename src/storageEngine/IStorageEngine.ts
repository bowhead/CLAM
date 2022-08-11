interface IStorageEngine {
    /**
     * Save file in a specific storage engine
     * @param {any} options - File to save and additional parameters
     * @returns {Promise<string>} returns the file identifier or location
     */
    saveFile(options: any): Promise<string>;

    /**
     * Get file from storage engine
     * @param {any} options - File identifier or location and additional parameters
     * @returns {Promise<string>} returns the file
     */
    getFile(options: any): Promise<string>;
    
    /**
     * Update file stored
     * @param {any} options - File identifier or location and additional parameters
     */
    updateFile(options: any): Promise<void>;

    /**
     * Delete file from storage engine
     * @param {any} options - Identifier of the file to delete and additional parameters
     */
    deleteFile(options: any): Promise<void>;
}

export default IStorageEngine;
