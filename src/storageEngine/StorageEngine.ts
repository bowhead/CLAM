import IStorageEngine from './IStorageEngine';
import { injectable } from 'tsyringe';
import axios, { AxiosInstance } from 'axios';
import { ecsign } from 'ethereumjs-util';
import FormData from 'form-data';
import { Buffer } from 'buffer';

/**
 * Storage engine to save, update, get and delete files from IPFS.
 * You can inject your preferred storage engine.
 */
@injectable()
class StorageEngine implements IStorageEngine {
    private instance: AxiosInstance;

    /**
     * Storage engine costructor
     * Using to initialize the axios instance
     * @param {IIPFSConstructor} options - Connection options
     */
    constructor (options: IIPFSConstructor) {
        this.instance = axios.create({
            baseURL: options.URL,
            timeout: options.timeout,
            headers: {
                'x-api-key': options.ApiKey
            }
        });
    }

    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     * @throws {BadRequestError} File was not save on IPFS
     * @throws {InternaServerError} Internal server error
     */
    async saveFile(options: object): Promise<string> {
        const body = options as IIPFSSave;
        
        const formData = new FormData();
        
        formData.append('file', body.file);
        formData.append('address', body.address);
        formData.append('fileName', body.fileName);
        
        const res = await this.instance.post('/file', formData);
        
        return res.data.CID;
    }

    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file
     * @throws {NotFoundError} File not found in IPFS
     * @throws {InternaServerError} Internal server error
     */
    async getFile(options: object): Promise<string> {
        const params = options as IIPFSDocument;
        
        const file = await this.instance.get(`/file?address=${params.address}&cid=${params.cid}`);
        
        return file.data.file;
    }
    
    /**
     * Update file stored
     * @param {object} options - File identifier or location and additional parameters
     * @throws {NotFoundError} File not found in IPFS or not registered in smart contract
     * @throws {ForbiddenError} User is not the owner of the file
     * @throws {InternaServerError} Internal server error
     */
    async updateFile(options: object): Promise<void> {
        const body = options as IIPFSUpdate;

        const formData = new FormData();

        const serverHash = await this.getChallenge(body.address);

        const signature = this.generateSignature(serverHash, body.privateKey);

        formData.append('file', body.file);
        formData.append('address', body.address);
        formData.append('cid', body.cid || '');
        formData.append('sigV', signature.sigV.toString());
        formData.append('sigR', signature.sigR);
        formData.append('sigS', signature.sigS);
        formData.append('hash', serverHash);

        await this.instance.put('/file', formData);
    }

    /**
     * Delete file from storage engine
     * @param {object} options - Identifier of the file to delete and additional parameters
     * @throws {NotFoundError} File not found in IPFS or not registered in smart contract
     * @throws {ForbiddenError} User is not the owner of the file
     * @throws {InternaServerError} Internal server error
     */
    async deleteFile(options: object): Promise<void> {
        const params = options as IIPFSDelete;

        const serverHash = await this.getChallenge(params.address);

        const signature = this.generateSignature(serverHash, params.privateKey);

        const body = {
            address: params.address,
            cid: params.cid,
            hash: serverHash,
            sigV: signature.sigV,
            sigR: signature.sigR,
            sigS: signature.sigS
        };

        await this.instance.delete('/file', {data : body});
    }

    /**
     * Get hash by user address
     * @param {string} address - User address
     * @returns {Promise<string>} returns hash made by user address
     */
    private async getChallenge (address: string): Promise<string> {
        const res = await this.instance.get(`/challenge?address=${address}`);

        return res.data.hash;
    }

    /**
     * Generate signature from hash
     * @param {string} serverHash - Hash
     * @param {string} privateKey - Private key
     * @returns {IIPFSSignature} Signature
     */
    private generateSignature(serverHash: string, privateKey: string): IIPFSSignature {
        const hash = Buffer.from(serverHash, 'hex');
        const privateKeyBuffer = Buffer.from(privateKey, 'hex');
        const { v, r, s } = ecsign(hash, privateKeyBuffer);

        const signData: IIPFSSignature = {
            hash: serverHash,
            sigR: r.toString('hex'),
            sigS: s.toString('hex'),
            sigV: v
        };

        return signData;
    }
}

export default StorageEngine;