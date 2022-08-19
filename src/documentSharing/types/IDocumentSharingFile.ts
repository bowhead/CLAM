import { ReadStream } from 'fs';

export interface IDocumentSharingFile {
    file?: ReadStream;
    cid: string;
    owner?: string;
}