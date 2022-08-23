import { ReadStream } from 'fs';
import { Interaction } from '../../contractIntegration';

export interface IDocumentSharingFile {
    file?: ReadStream;
    cid: string;
    owner?: string;
    consentId: string;
    contractInteraction: Interaction;
}