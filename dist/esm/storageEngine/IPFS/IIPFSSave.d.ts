import { IIpfsDocument } from './IIPFSDocuments';
export interface IIpfsSave extends IIpfsDocument {
    file: string;
    fileName: string;
    keepOriginalName: boolean;
}
