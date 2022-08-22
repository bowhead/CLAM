import { IdentityManager } from "../../indentityManager";
import IIPFSManagementFiles from "./IIPFSManagementFiles";

interface IIPFSManagementInteraction {
    /**
     * Add file to IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {string} fileName - File name
     * @param {IdentityManager} identity - Identity of the file owner
     */
    addFile(fileHash: string, fileName: string, identity: IdentityManager): Promise<void>;

    /**
     * Remove file from IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - Identity of the file owner
     */
    removeFile(fileHash: string, identity: IdentityManager): Promise<void>;

    /**
     * Check if the user can access to the file
     * @param {string} fileHash - File identifier or location 
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if has access, false if not
     */
    checkAccess(fileHash: string, identity: IdentityManager): Promise<boolean>;

    /**
     * Check if the file is available
     * @param {string} fileHash - File identifier or location 
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if is available, false if not
     */
    fileIsAvailable(fileHash: string, identity: IdentityManager): Promise<boolean>;

    /**
     * Get list of user files
     * @param {IdentityManager} identity - User identity 
     * @returns {Promise<IIPFSManagementFiles>} returns file list
     */
    getFiles(identity: IdentityManager): Promise<IIPFSManagementFiles>;
}

export default IIPFSManagementInteraction;