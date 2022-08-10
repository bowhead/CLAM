interface IStorageEngine {
    /**
     * Save file in a specific storage engine
     * @param options - File to save and additional parameters
     * @returns returns the file identifier or location
     */
    saveFile(options: any): Promise<string>;

    /**
     * Get file from storage engine
     * @param options - File identifier or location and additional parameters
     * @returns returns the file
     */
    getFile(options: any): Promise<string>;

    /**
     * Update file stored
     * @param options - File identifier or location and additional parameters
     */
    updateFile(options: any): Promise<void>;

    /**
     * Delete file from storage engine
     * @param options - Identifier of the file to delete and additional parameters
     */
    deleteFile(options: any): Promise<void>;
}

export default IStorageEngine;
