import IStorageEngine from './IStorageEngine';
/**
 * Storage engine to save, update, get and delete files from IPFS.
 * You can inject your preferred storage engine.
 */
declare class IPFSEngine implements IStorageEngine {
    private instance;
    /**
     * Set IPFS connection settings
     * @param {object} options - Connection options
     */
    setConfiguration(options: object): void;
    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     * @throws {BadRequestError} File was not save on IPFS
     * @throws {InternalServerError} Internal server error
     */
    saveFile(options: object): Promise<string>;
    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file
     * @throws {NotFoundError} File not found in IPFS
     * @throws {InternalServerError} Internal server error
     */
    getFile(options: object): Promise<string>;
    /**
     * Update file stored
     * @param {object} options - File identifier or location and additional parameters
     * @throws {NotFoundError} File not found in IPFS or not registered in smart contract
     * @throws {ForbiddenError} User is not the owner of the file
     * @throws {InternalServerError} Internal server error
     */
    updateFile(options: object): Promise<void>;
    /**
     * Delete file from storage engine
     * @param {object} options - Identifier of the file to delete and additional parameters
     * @throws {NotFoundError} File not found in IPFS or not registered in smart contract
     * @throws {ForbiddenError} User is not the owner of the file
     * @throws {InternalServerError} Internal server error
     */
    deleteFile(options: object): Promise<void>;
    /**
     * Get hash by user address
     * @param {string} address - User address
     * @returns {Promise<string>} returns hash made by user address
     */
    private getChallenge;
    /**
     * Generate signature from hash
     * @param {string} serverHash - Hash
     * @param {string} privateKey - Private key
     * @returns {IIpfsSignature} Signature
     */
    private generateSignature;
}
export default IPFSEngine;
