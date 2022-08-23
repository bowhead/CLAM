import 'reflect-metadata';
import { IEncryptionLayer, EncryptionLayerPGP, EncryptioLayerAES } from './encryptionLayer';
import { IdentityManager, ShareableIdentity } from './indentityManager';
import { IKeys, IKeysGenerator, KeysGeneratorPGP } from './keysGenerator';
import FactoryIdentity from './factoryIdentity/FactoryIdentity';
import { StorageEngine, IStorageEngine } from './storageEngine';
import {FactoryInteraction} from "./contractIntegration"
import { DocumentSharing, IDocumentSharing } from './documentSharing';

export {
    IdentityManager,
    ShareableIdentity,
    EncryptionLayerPGP,
    EncryptioLayerAES,
    FactoryIdentity,
    FactoryInteraction,
    KeysGeneratorPGP,
    IEncryptionLayer,
    IKeys,
    IKeysGenerator,
    StorageEngine,
    IStorageEngine,
    DocumentSharing,
    IDocumentSharing
};
