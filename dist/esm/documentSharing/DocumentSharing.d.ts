import { IdentityManager } from '../indentityManager';
import IDocumentSharing from './IDocumentSharing';
import { IStorageEngine } from '../storageEngine';
/**
 * Document sharing, allow save encrypted files and sharing them with another users.
 */
declare class DocumentSharing implements IDocumentSharing {
    private storageEngine;
    /**
     * Document sharing constructor
     * Using to set storage engine instance
     * @param {IStorageEngine} instance - Storage engine instance
     */
    constructor(instance: IStorageEngine);
    /**
     * Save file encrypted with AES on storage engine
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     */
    saveFile(identity: IdentityManager, options: object): Promise<string>;
    /**
     * Get file encrypted with AES
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file in base64
     */
    getFile(identity: IdentityManager, options: object): Promise<string>;
    /**
     * Update file encrypted with AES on storage engine
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File identifier or location and additional parameters
     */
    updateFile(identity: IdentityManager, options: object): Promise<void>;
    /**
     * Save file shared on storage engine, it is encrypted with PGP
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File to save and additional parameters
     * @param {string} userIds - PGP public keys of users authorized to view the shared file
     * @returns {string} returns the file identifier or location
     */
    sharedFile(identity: IdentityManager, options: object, userIds: string): Promise<string>;
    /**
     * Get file shared encrypted with PGP
     * @param {IdentityManager} identity - User identity that is allowed to get file
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file in base64
     */
    getSharedFile(identity: IdentityManager, options: object): Promise<string>;
}
export default DocumentSharing;
