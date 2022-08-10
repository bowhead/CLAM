import IStorageEngine from "./IStorageEngine";
import { injectable } from 'tsyringe';
import axios from "axios";
import { ecsign } from 'ethereumjs-util';
import FormData from 'form-data';

@injectable()
class StorageEngine implements IStorageEngine {
    private instance: any;

    /**
     * Storage engine costructor
     * Using to initialize the axios instance
     * @param options - Connection options
     */
    constructor (options: any) {
        this.instance = axios.create({
            baseURL: options.URL,
            timeout: 2000,
            headers: {
                'x-api-key': options.ApiKey
            }
        });
    }

    /**
     * Save file in a specific storage engine
     * @param options - File to save and additional parameters
     * @returns returns the file identifier or location
     */
    async saveFile(options: any): Promise<string> {
        try {
            const body = options as IIPFSSave;

            const formData = new FormData();

            formData.append('file', body.file);
            formData.append('address', body.address);
            formData.append('fileName', body.fileName);

            const cid = await this.instance.post('/file', formData);

            return cid.data.CID;
            
        } catch (error) {
            console.log(error)
            throw new Error("Catch not implemented.");
        }
    }

    /**
     * Get file from storage engine
     * @param options - File identifier or location and additional parameters
     * @returns returns the file
     */
    async getFile(options: any): Promise<string> {
        try {
            const params = options as IIPFSDocument;

            const file = await this.instance.get(`/file?address=${params.address}&cid=${params.cid}`);
            
            return file.data.file;
        } catch (error) {
            if(error.response.status === 404) {
                return '';
            } else {
                throw Error(error.message)
            }            
        }
    }
    
    /**
     * Update file stored
     * @param options - File identifier or location and additional parameters
     */
    async updateFile(options: any): Promise<void> {
        try {
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
            
        } catch (error) {
            if (error.response.status !== 500 ) {
                throw new Error(error.response.data.message)
            } else {
                throw new Error(error);
            }          
        }
    }

    /**
     * Delete file from storage engine
     * @param options - Identifier of the file to delete and additional parameters
     */
    async deleteFile(options: any): Promise<void> {
        try {
            let params = options as IIPFSDelete;

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
            
        } catch (error) {
            if (error.response.status !== 500 ) {
                throw new Error(error.response.data.message)
            } else {
                throw new Error(error);
            }   
        }
    }

    /**
     * Get hash by user address
     * @param address - User address
     * @returns returns hash made by user address
     */
    private async getChallenge (address: string) {
        try {
            const res = await this.instance.get(`/challenge?address=${address}`);

            return res.data.hash;
        } catch (error) {
            throw ('Error')
        }
    }

    /**
     * Generate signature from hash
     * @param {string} serverHash - Hash
     * @param {string} privateKey - Private key
     * @returns Signature
     */
    private generateSignature(serverHash : string, privateKey : string) {
        const hash = Buffer.from(serverHash, 'hex');
        let privateKeyBuffer = Buffer.from(privateKey, "hex");
        const { v, r, s } = ecsign(hash, privateKeyBuffer);

        const signData : IIPFSSignature = {
            hash: serverHash,
            sigR: r.toString('hex'),
            sigS: s.toString('hex'),
            sigV: v
        };

        return signData;
    }

}

export default StorageEngine;