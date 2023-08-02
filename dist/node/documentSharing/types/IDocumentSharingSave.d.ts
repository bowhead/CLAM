import { Interaction } from '../../contractIntegration';
export interface IDocumentSharingSave {
    file: string;
    fileName: string;
    consentId: string;
    contractInteraction: Interaction;
    keepOriginalName: boolean;
}
