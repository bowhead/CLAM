import { ReadStream } from 'fs';
import { Interaction } from '../../contractIntegration';

export interface IDocumentSharingSave {
    file: ReadStream;
    fileName: string;
    consentId: string;
    contractInteraction: Interaction;
}