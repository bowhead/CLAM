import 'reflect-metadata';
import { IEncryptionLayer, EncryptionLayerPGP, EncryptioLayerAES } from './encryptionLayer';
import { IdentityManager, ShareableIdentity } from './indentityManager';
import { IKeys, IKeysGenerator, KeysGeneratorPGP } from './keysGenerator';
import FactoryIdentity from './factoryIdentity/FactoryIdentity';
import { StorageEngine, IStorageEngine } from './storageEngine';
import {FactoryInteraction} from "./contractIntegration"
import Web3Provider from './contractIntegration/interaction/Wbe3Provider';
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
    Web3Provider,
    IStorageEngine,
    DocumentSharing,
    IDocumentSharing
};
