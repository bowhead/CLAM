import { Interaction } from '../../contractIntegration';

export interface IDocumentSharingFile {
    file?: string;
    cid: string;
    owner?: string;
    consentId: string;
    contractInteraction: Interaction;
}