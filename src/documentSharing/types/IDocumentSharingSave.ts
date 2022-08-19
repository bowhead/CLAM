import { ReadStream } from 'fs';

export interface IDocumentSharingSave {
    file: ReadStream;
    fileName: string;
}