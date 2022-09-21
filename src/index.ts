import 'reflect-metadata';
import { IEncryptionLayer, EncryptionLayerPGP, EncryptionLayerAES } from './encryptionLayer';
import { IdentityManager, ShareableIdentity } from './indentityManager';
import { IKeys, IKeysGenerator, KeysGeneratorPGP } from './keysGenerator';
import FactoryIdentity from './factoryIdentity/FactoryIdentity';
import { StorageEngine, Storage, IStorageEngine } from './storageEngine';
import {FactoryInteraction} from './contractIntegration';
import Web3Provider from './contractIntegration/interaction/Wbe3Provider';
import { DocumentSharing, IDocumentSharing } from './documentSharing';
import FactoryWeb3Interaction from "./contractIntegration/interaction/web3Provider/FactoryWeb3Interaction";

export {
    IdentityManager,
    ShareableIdentity,
    EncryptionLayerPGP,
    EncryptionLayerAES,
    FactoryIdentity,
    FactoryInteraction,
    KeysGeneratorPGP,
    IEncryptionLayer,
    IKeys,
    IKeysGenerator,
    StorageEngine,
    Storage,
    IStorageEngine,
    Web3Provider,
    DocumentSharing,
    IDocumentSharing,
    FactoryWeb3Interaction
};
