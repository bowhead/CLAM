import { IdentityManager } from '../indentityManager';
import IDocumentSharing from './IDocumentSharing';
//eslint-disable-next-line @typescript-eslint/no-unused-vars
import { injectable } from 'tsyringe';
import { IStorageEngine } from '../storageEngine';
import { IDocumentSharingSave } from './types/IDocumentSharingSave'; 
import { IDocumentSharingFile } from './types/IDocumentSharingFile';

/**
 * Document sharing, allow save encrypted files and sharing them with another users.
 */
@injectable()
class DocumentSharing implements IDocumentSharing {
    private storageEngine: IStorageEngine;

    /**
     * Document sharing constructor
     * Using to set storage engine instance
     * @param {IStorageEngine} instance - Storage engine instance
     */
    constructor (instance: IStorageEngine) {
        this.storageEngine = instance;
    }

    /**
     * Save file encrypted with AES on storage engine
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     */
    async saveFile(identity: IdentityManager, options: object): Promise<string> {
        const body = options as IDocumentSharingSave;

        if(!body.file) throw new Error('File parameter is missing');

        const consentApproved = await body.contractInteraction.consentInteraction.getConsentById(body.consentId, identity.address, identity); 
        
        if (!consentApproved) throw new Error('Consent is not approved');

        const fileEncrypted = await identity.encryptionLayer.encryptData(identity.privateKey, body.file || '');

        const data = {
            file: fileEncrypted,
            address: identity.address,
            fileName: body.fileName,
            keepOriginalName: body.keepOriginalName || false
        };

        const cid = await this.storageEngine.saveFile(data);

        return cid;
    }

    /**
     * Get file encrypted with AES
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file in base64
     */
    async getFile(identity: IdentityManager, options: object): Promise<string> {
        const info = options as IDocumentSharingFile;

        if (!info.cid) throw new Error('File identifier is missing');

        const params = {
            cid: info.cid,
            address: identity.address
        };

        const file = await this.storageEngine.getFile(params);

        const decodeFile = Buffer.from(file, 'base64').toString('utf8');

        const decryptedFile = identity.encryptionLayer.decryptData(identity.privateKey, decodeFile);

        return decryptedFile;
    }

    /**
     * Update file encrypted with AES on storage engine
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File identifier or location and additional parameters
     */
    async updateFile(identity: IdentityManager, options: object): Promise<void> {
        const body = options as IDocumentSharingFile;

        if(!body.file) throw new Error('File parameter is missing');

        const fileEncrypted = await identity.encryptionLayer.encryptData(identity.privateKey, body.file);

        const data = {
            file: fileEncrypted,
            address: identity.address,
            cid: body.cid,
            privateKey: identity.privateKey
        };

        await this.storageEngine.updateFile(data);
    }

    /**
     * Save file shared on storage engine, it is encrypted with PGP
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File to save and additional parameters
     * @param {string} userIds - PGP public keys of users authorized to view the shared file
     * @returns {string} returns the file identifier or location 
     */
    async sharedFile(identity: IdentityManager, options: object, userIds: string): Promise<string> {
        const body =  options as IDocumentSharingSave;

        if(!body.file) throw new Error('File parameter is missing');

        const consentApproved = await body.contractInteraction.consentInteraction.getConsentById(body.consentId, identity.address, identity); 
        
        if (!consentApproved) throw new Error('Consent is not approved');

        userIds += `,${identity.publicKeySpecial}`;

        const fileEncrypted = await identity.encryptionLayer.encryptData(userIds, body.file);

        const data = {
            file: fileEncrypted,
            address: identity.address,
            fileName: body.fileName,
            keepOriginalName: body.keepOriginalName || false
        };

        const cid = await this.storageEngine.saveFile(data);

        return cid;
    }

    /**
     * Get file shared encrypted with PGP
     * @param {IdentityManager} identity - User identity that is allowed to get file
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file in base64 
     */
    async getSharedFile(identity: IdentityManager, options: object): Promise<string> {
        const info = options as IDocumentSharingFile;

        if (!info.cid) throw new Error('File identifier is missing');

        const access = await info.contractInteraction.accessInteraction.checkAccess(info.cid, info.consentId, identity);

        if (!access) throw new Error('You do not have access to the resource');

        const params = {
            cid: info.cid,
            address: info.owner || ''
        };

        const file = await this.storageEngine.getFile(params);

        const decodeFile = Buffer.from(file, 'base64').toString('utf8');

        const decryptedFile = await identity.encryptionLayer.decryptData(identity.privateKeySpecial, decodeFile);

        return decryptedFile;
    }
}

export default DocumentSharing;