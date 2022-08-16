import { IdentityManager } from "../indentityManager";

interface IDocumentSharing {
    /**
     * Encrypting file and save this on storage engine
     * @param {IdentityManager} identity - User identity
     * @param {object} options  - File to save and additional parameters
     * @returns {Promise<string>} returns the file identifier or location
     */
    saveFile(identity: IdentityManager, options: object): Promise<string>;
    
    /**
     * Get unencrypted file 
     * @param {IdentityManager} identity - User identity
     * @param {object} options - File identifier or location and additional paramters
     * @returns {Promise<string>} returns the file
     */
    getFile(identity: IdentityManager, options: object): Promise<string>;

    /**
     * Update file stored
     * @param {IdentityManager} identity - User identity 
     * @param {object} options - File to update and additional parameters
     */
    updateFile(identity: IdentityManager, options: object): Promise<void>;

    /**
     * Shared file 
     * @param {IdentityManager} identity - User identity 
     * @param {object} options - File identifier or location and additional paramters
     * @param {string} userId - User id to share file
     */
    sharedFile(identity: IdentityManager, options: object, userId: string): Promise<void>;

    /**
     * Get shared file 
     * @param {IdentityManager} identity - User identity
     * @param {object} options - File identifier or location and additional paramters
     * @returns {Promise<string>} returns the file
     */
    getSharedFile(identity: IdentityManager, options: object): Promise<string>;
}

export default IDocumentSharing;
