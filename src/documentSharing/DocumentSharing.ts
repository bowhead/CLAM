import { IdentityManager } from '../indentityManager';
import IDocumentSharing from './IDocumentSharing';
import { injectable } from 'tsyringe';

/**
 * Document sharing, allow save encrypted files and sharing them with another users.
 */
@injectable()
class DocumentSharing implements IDocumentSharing {
    saveFile(identity: IdentityManager, options: object): Promise<string> {
        throw new Error("Method not implemented.");
    }

    getFile(identity: IdentityManager, options: object): Promise<string> {
        throw new Error("Method not implemented.");
    }

    updateFile(identity: IdentityManager, options: object): Promise<void> {
        throw new Error("Method not implemented.");
    }

    sharedFile(identity: IdentityManager, options: object, userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getSharedFile(identity: IdentityManager, options: object): Promise<string> {
        throw new Error("Method not implemented.");
    }
}

export default DocumentSharing;