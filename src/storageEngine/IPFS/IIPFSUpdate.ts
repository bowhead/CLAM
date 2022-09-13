import { IIpfsDocument } from './IIPFSDocuments';

export interface IIpfsUpdate extends IIpfsDocument {
    file: File;
    privateKey: string;
}
