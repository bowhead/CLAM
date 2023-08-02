'use strict';

require('reflect-metadata');
var CryptoES = require('crypto-es');
var tsyringe = require('tsyringe');
var openpgp = require('openpgp');
var Mnemonic = require('bitcore-mnemonic');
var HDWallet = require('ethereum-hdwallet');
var axios = require('axios');
var ethereumjsUtil = require('ethereumjs-util');
var FormData = require('form-data');
var buffer = require('buffer');
var Web3 = require('web3');
var Web3Bowhead = require('bowhead-web3');
var ethereumjsTx = require('ethereumjs-tx');
var Common = require('ethereumjs-common');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var Mnemonic__namespace = /*#__PURE__*/_interopNamespaceDefault(Mnemonic);
var HDWallet__namespace = /*#__PURE__*/_interopNamespaceDefault(HDWallet);
var Web3Bowhead__namespace = /*#__PURE__*/_interopNamespaceDefault(Web3Bowhead);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

/**
 * This class is the implementation of EncryptionLayer using the AES algorithm.
 */
let EncryptionLayerAES = class EncryptionLayerAES {
    constructor() {
        this.keySize = 256;
        this.iterations = 100;
    }
    /**
     * This function encrypts the data passed as a parameter
     * using the key passed as a parameter with the AES-25 algorithm.
     *
     * @param {string} key This parameter is the key with which the information will be encrypted.
     * @param {string} data This parameter is the information to be encrypted.
     * @returns {string} returns a string promise, when resolved it returns a string representing the encrypted data.
     */
    encryptData(key, data) {
        if (key.trim().length === 0 || key.trim().length < 3)
            throw new Error('Error, the length of the key to encrypt the data must be greater than 5');
        if (data.trim().length === 0)
            throw new Error('The data must have at least one character');
        const salt = CryptoES.lib.WordArray.random(128 / 8);
        const keyEncrypt = CryptoES.PBKDF2(key, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations,
        });
        const iv = CryptoES.lib.WordArray.random(128 / 8);
        const encrypted = CryptoES.AES.encrypt(data, keyEncrypt, {
            iv: iv,
            padding: CryptoES.pad.Pkcs7,
            mode: CryptoES.mode.CBC,
        });
        const transitMessage = salt.toString() + iv.toString() + encrypted.toString();
        return Promise.resolve(transitMessage);
    }
    /**
     * This function decrypt the data passed as a parameter
     * using the key passed as a parameter.
     *
     * @param {string} key This parameter is the key which the information will be decrypted.
     * @param {string} data This parameter is the data encrypted to be decrypted.
     * @returns {string} return a string promise, when resolve it returns a string representing the decrypted data.
     */
    decryptData(key, data) {
        if (key.trim().length === 0 || key.trim().length < 3)
            throw new Error('Error, the length of the key to decrypt the data must be greater than 5');
        if (data.trim().length === 0)
            throw new Error('The data must have at least one character');
        const salt = CryptoES.enc.Hex.parse(data.substr(0, 32));
        const iv = CryptoES.enc.Hex.parse(data.substr(32, 32));
        const encrypted = data.substring(64);
        const keyEncrypt = CryptoES.PBKDF2(key, salt, {
            keySize: this.keySize / 32,
            iterations: this.iterations,
        });
        const decrypted = CryptoES.AES.decrypt(encrypted, keyEncrypt, {
            iv: iv,
            padding: CryptoES.pad.Pkcs7,
            mode: CryptoES.mode.CBC,
        });
        return Promise.resolve(decrypted.toString(CryptoES.enc.Utf8));
    }
};
EncryptionLayerAES = __decorate([
    tsyringe.injectable()
], EncryptionLayerAES);
var EncryptionLayerAES$1 = EncryptionLayerAES;

/**
 * This class is the implementation of EncryptionLayer using the PGP algorithm.
 */
let EncryptionLayerPGP = class EncryptionLayerPGP {
    constructor() {
        /**
         * This function encrypts the data passed as a parameter using the
         * public key passed as a parameter.
         *
         * @param {string} publicKeyPGP This parameter is the public key to encrypt the data.
         * @param {string} data This parameter is the data that will be encrypted.
         * @returns {string} returns a string promise, when resolved it returns a string representing the encrypted data.
         */
        this.encryptData = async (publicKeyPGP, data) => {
            if (data.trim().length == 0)
                throw new Error('The data must have at least one character');
            const pubKeys = publicKeyPGP.split(',');
            const publicKeys = pubKeys.map(async (key) => {
                return (await openpgp.readKey({ armoredKey: key }));
            });
            const encrypted = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: data }),
                encryptionKeys: await Promise.all(publicKeys),
            });
            return encrypted.toString();
        };
        /**
         * This function decrypt the data passed as a parameter using the
         * private key passed as a parameter.
         *
         * @param {string} privateKeyPGP This parameter is the private key to decrypt the data.
         * @param {string} dataEncrypted This parameter is the encrypted data that will be decrypted.
         * @returns {string} return a string promise, when resolve it returns a string representing the decrypted data.
         */
        this.decryptData = async (privateKeyPGP, dataEncrypted) => {
            if (dataEncrypted.trim().length == 0)
                throw new Error('The data must have at least one character');
            const privateKeysArr = privateKeyPGP.split(',');
            const privateKeys = privateKeysArr.map(async (key) => {
                return await openpgp.decryptKey({
                    privateKey: await openpgp.readPrivateKey({ armoredKey: key }),
                    passphrase: 'passphrase'
                });
            });
            const message = await openpgp.readMessage({
                armoredMessage: dataEncrypted
            });
            const { data: decrypted } = await openpgp.decrypt({
                message,
                decryptionKeys: await Promise.all(privateKeys)
            });
            return decrypted.toString();
        };
    }
};
EncryptionLayerPGP = __decorate([
    tsyringe.injectable()
], EncryptionLayerPGP);
var EncryptionLayerPGP$1 = EncryptionLayerPGP;

const { fromMnemonic: fromMnemonic$1 } = HDWallet__namespace;
/**
 * This class is to create your mnemonic, address, public key and private key to build your identity,
 * it also provides you with the functionality to create your PGP keys using the implementation of
 * the IEncryptionLayer interface to generate your PGP keys, with these keys you will be able to
 * encrypt and decrypt information.
 */
let IdentityManager = class IdentityManager {
    /**
     * This constructor initializes the class instance with the values passed as parameters.
     *
     * @param  {IEncryptionLayer} encryptionLayer this parameter is the EncryptionLayer implementation.
     * @param {IKeysGenerator} keysGenerator this is parameter is the KeysGenerator implementation.
     */
    constructor(encryptionLayer, keysGenerator) {
        /**
         * This function generates an identity based on the mnemonic passed as parameters, in case of not passing
         * the mnemonic a new identity will be created based on a totally new mnemonic.
         *
         * @param {string} mnemonic This parameter is the 12 words that will be used to generate the identity information.
         */
        this.generateIdentity = async (mnemonic = '') => {
            if (this.mnemonic.trim() === '' && this.address.trim() === '' &&
                this.privateKey.trim() === '' && this.publicKey.trim() == '') {
                this.mnemonic = mnemonic.trim() === '' ? new Mnemonic__namespace(Mnemonic__namespace.Words.ENHLISH).toString() : mnemonic;
                const hdwallet = fromMnemonic$1(this.mnemonic);
                this.address = `0x${hdwallet.derive('m/44\'/60\'/0\'/0/0').getAddress().toString('hex')}`;
                this.privateKey = hdwallet.derive('m/44\'/60\'/0\'/0/0').getPrivateKey(true).toString('hex');
                this.publicKey = hdwallet.derive('m/44\'/60\'/0\'/0/0').getPublicKey(true).toString('hex');
            }
            const data = {
                name: this.address,
                email: `${this.address}@localhost.com`
            };
            if (!this.keysGenerator)
                throw new Error('Please set a specific implementation of keysGenerator');
            const { privateKey, publicKey } = await this.keysGenerator.generateKeys(data);
            this.privateKeySpecial = privateKey;
            this.publicKeySpecial = publicKey;
        };
        this.mnemonic = '';
        this.address = '';
        this.privateKey = '';
        this.publicKey = '';
        this.privateKeySpecial = '';
        this.publicKeySpecial = '';
        this.encryptionLayer = encryptionLayer;
        this.keysGenerator = keysGenerator;
    }
};
IdentityManager = __decorate([
    tsyringe.injectable(),
    __param(0, tsyringe.inject('EncryptionLayer')),
    __param(1, tsyringe.inject('KeysGenerator')),
    __metadata("design:paramtypes", [Object, Object])
], IdentityManager);
var IdentityManager$1 = IdentityManager;

/**
 * This class
 */
let KeysGeneratorPGP = class KeysGeneratorPGP {
    constructor() {
        /**
         * This function generate keys using an specific implementation.
         *
         * @param {any} data This parameter is the information to generate the keys.
         * @returns {Primise<IKeys>} return the keys.
         */
        this.generateKeys = async (data) => {
            const PGPKeys = {
                privateKey: '',
                publicKey: ''
            };
            const { name, email } = data;
            const { privateKey, publicKey } = await openpgp.generateKey({
                type: 'ecc',
                curve: 'curve25519',
                userIDs: [{ name, email }],
                passphrase: 'passphrase',
                format: 'armored'
            });
            PGPKeys.privateKey = privateKey;
            PGPKeys.publicKey = publicKey;
            return PGPKeys;
        };
    }
};
KeysGeneratorPGP = __decorate([
    tsyringe.injectable()
], KeysGeneratorPGP);
var KeysGeneratorPGP$1 = KeysGeneratorPGP;

/**
 * This class is used to generate identities based on the EncryptionLayer
 * and KeysGenerator implementations making use of inject containers.
 */
class FactoryIdentity {
    /**
     * Constructor that initializes the class instance, setting two options for
     * EncryptionLayer (AES, PGP) and one option for KeysGenerator (PGP).
     */
    constructor() {
        this.optionsEncryptionLayer = [
            { name: 'AES', option: EncryptionLayerAES$1 },
            { name: 'PGP', option: EncryptionLayerPGP$1 },
        ];
        this.optionsKeysGenerator = [
            { name: 'PGP', option: KeysGeneratorPGP$1 }
        ];
    }
    /**
     * This function sets a new implementation for EncryptionLayer.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionEncryption(option) {
        const optionEncryptionExist = this.optionsEncryptionLayer.find(optionAux => optionAux.name === option.name);
        if (optionEncryptionExist)
            throw new Error('This option already exists.');
        this.optionsEncryptionLayer.push(option);
    }
    /**
     * Set options to generate keys
     * @param {IOption} option - This parameter contains the name and class of the new implementation.
     */
    setOptionKeysGenerator(option) {
        const optionKeysGenerator = this.optionsKeysGenerator.find(optionAux => optionAux.name === option.name);
        if (optionKeysGenerator) {
            throw new Error('This option already exists.');
        }
        this.optionsKeysGenerator.push(option);
    }
    /**
     * This function generates a new identity with past implementations as parameters.
     *
     * @param {string} encryptionLayerType This parameter is the option of EncryptionLayer implementation.
     * @param {string} generatorKeysType This parameter is the option of KeysGenerator implementation.
     * @returns {IdentityManager} return a new instance of IdentityManager.
     */
    generateIdentity(encryptionLayerType, generatorKeysType) {
        const encryptionLayer = this.optionsEncryptionLayer.find(option => option.name.toLowerCase() === encryptionLayerType.toLowerCase());
        const keysGenerator = this.optionsKeysGenerator.find(option => option.name.toLowerCase() === generatorKeysType.toLowerCase());
        if (!encryptionLayer)
            throw new Error('The encryptionLayer type doesn\'t exist');
        if (!keysGenerator)
            throw new Error('The keysGenerator type doesn\'t exist');
        tsyringe.container.register('EncryptionLayer', encryptionLayer.option);
        tsyringe.container.register('KeysGenerator', keysGenerator.option);
        const identity = tsyringe.container.resolve(IdentityManager$1);
        return identity;
    }
}

const { fromMnemonic } = HDWallet__namespace;
/**
 * This class allows you to create N identities based on a main identity,
 * thus generating compatible and child identities based on the main identity.
 */
class ShareableIdentity {
    /**
     * Constructor that initializes your ShareableIdentity component
     * using the values passed as parameters.
     *
     * @param {IdentityManager} mainIdentity This parameter is the main identity for instantiating many identities.
     */
    constructor(mainIdentity) {
        /**
         * This function generates N identities based on the main identity.
         *
         * @param {number} count this parameter is the number of identities that will be
         * instantiated from the main identity.
         */
        this.generateIdentities = async (count) => {
            if (count === 0 || count < 1)
                throw new Error('The count must be greater than 0');
            if (this.mainIdentity.mnemonic.length != 0) {
                const auxWallet = fromMnemonic(this.mainIdentity.mnemonic);
                let address = '';
                let privateKey = '';
                let publicKey = '';
                for (let i = this.lastIdentity; i <= count; i++) {
                    address = `0x${auxWallet.derive(`m/44'/60'/0'/0/${i}`).getAddress().toString('hex')}`;
                    privateKey = auxWallet.derive(`m/44'/60'/0'/0/${i}`).getPrivateKey(true).toString('hex');
                    publicKey = auxWallet.derive(`m/44'/60'/0'/0/${i}`).getPublicKey(true).toString('hex');
                    //Setting info
                    const newIdentityChild = new IdentityManager$1(this.mainIdentity.encryptionLayer, this.mainIdentity.keysGenerator);
                    newIdentityChild.mnemonic = this.mainIdentity.mnemonic;
                    newIdentityChild.address = address;
                    newIdentityChild.privateKey = privateKey;
                    newIdentityChild.publicKey = publicKey;
                    await newIdentityChild.generateIdentity();
                    this.identities.push(newIdentityChild);
                    this.lastIdentity++;
                }
            }
            else {
                throw new Error('The main identity has to be initialized');
            }
        };
        /**
         * This function returns a specific identity.
         *
         * @param {number} index This parameter is the specific position in your identities.
         * @returns {IdentityManager} an instance of IdentityManager class.
         */
        this.getIdentityByIndex = (index) => {
            if (index < 0)
                throw new Error('Position must be equal or greater than 0');
            const factoryIdentity = new FactoryIdentity();
            let identity = factoryIdentity.generateIdentity('PGP', 'PGP');
            if (index >= 0 && index < this.identities.length) {
                identity = this.identities[index];
                this.identities[index];
            }
            return identity;
        };
        this.mainIdentity = mainIdentity;
        this.identities = [];
        this.lastIdentity = 1;
    }
}

/**
 * Storage to save, update, get and delete files from specific engine.
 * You can inject your preferred storage engine.
 */
let Storage = class Storage {
    /**
     * Inject implementation
     * @param {IStorageEngine} engine - Storage engine implementation
     */
    constructor(engine) {
        this.engine = engine;
    }
    /**
     * Set storage engine configurations
     * @param {object} options - Configuration options
     */
    setConfiguration(options) {
        this.engine.setConfiguration(options);
    }
    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     */
    async saveFile(options) {
        return await this.engine.saveFile(options);
    }
    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file
     */
    async getFile(options) {
        return await this.engine.getFile(options);
    }
    /**
     * Update file stored
     * @param {object} options - File identifier or location and additional parameters
     */
    async updateFile(options) {
        await this.engine.updateFile(options);
    }
    /**
     * Delete file from storage engine
     * @param {object} options - Identifier of the file to delete and additional parameters
     */
    async deleteFile(options) {
        await this.engine.deleteFile(options);
    }
};
Storage = __decorate([
    tsyringe.injectable(),
    __param(0, tsyringe.inject('Engine')),
    __metadata("design:paramtypes", [Object])
], Storage);
var Storage$1 = Storage;

/**
 * Storage engine to save, update, get and delete files from IPFS.
 * You can inject your preferred storage engine.
 */
class IPFSEngine {
    /**
     * Set IPFS connection settings
     * @param {object} options - Connection options
     */
    setConfiguration(options) {
        const config = options;
        this.instance = axios.create({
            baseURL: config.URL,
            timeout: config.timeout,
            headers: {
                'x-api-key': config.ApiKey
            }
        });
    }
    /**
     * Save file in a specific storage engine
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     * @throws {BadRequestError} File was not save on IPFS
     * @throws {InternalServerError} Internal server error
     */
    async saveFile(options) {
        const body = options;
        const formData = new FormData();
        formData.append('file', body.file);
        formData.append('address', body.address);
        formData.append('fileName', body.fileName);
        formData.append('keepOriginalName', String(body.keepOriginalName));
        const res = await this.instance.post('/file', formData);
        return res.data.CID;
    }
    /**
     * Get file from storage engine
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file
     * @throws {NotFoundError} File not found in IPFS
     * @throws {InternalServerError} Internal server error
     */
    async getFile(options) {
        const params = options;
        const file = await this.instance.get(`/file?address=${params.address}&cid=${params.cid}`);
        return file.data.file;
    }
    /**
     * Update file stored
     * @param {object} options - File identifier or location and additional parameters
     * @throws {NotFoundError} File not found in IPFS or not registered in smart contract
     * @throws {ForbiddenError} User is not the owner of the file
     * @throws {InternalServerError} Internal server error
     */
    async updateFile(options) {
        const body = options;
        const formData = new FormData();
        const serverHash = await this.getChallenge(body.address);
        const signature = this.generateSignature(serverHash, body.privateKey);
        formData.append('file', body.file);
        formData.append('address', body.address);
        formData.append('cid', body.cid || '');
        formData.append('sigV', signature.sigV.toString());
        formData.append('sigR', signature.sigR);
        formData.append('sigS', signature.sigS);
        formData.append('hash', serverHash);
        await this.instance.put('/file', formData);
    }
    /**
     * Delete file from storage engine
     * @param {object} options - Identifier of the file to delete and additional parameters
     * @throws {NotFoundError} File not found in IPFS or not registered in smart contract
     * @throws {ForbiddenError} User is not the owner of the file
     * @throws {InternalServerError} Internal server error
     */
    async deleteFile(options) {
        const params = options;
        const serverHash = await this.getChallenge(params.address);
        const signature = this.generateSignature(serverHash, params.privateKey);
        const body = {
            address: params.address,
            cid: params.cid,
            hash: serverHash,
            sigV: signature.sigV,
            sigR: signature.sigR,
            sigS: signature.sigS
        };
        await this.instance.delete('/file', { data: body });
    }
    /**
     * Get hash by user address
     * @param {string} address - User address
     * @returns {Promise<string>} returns hash made by user address
     */
    async getChallenge(address) {
        const res = await this.instance.get(`/challenge?address=${address}`);
        return res.data.hash;
    }
    /**
     * Generate signature from hash
     * @param {string} serverHash - Hash
     * @param {string} privateKey - Private key
     * @returns {IIpfsSignature} Signature
     */
    generateSignature(serverHash, privateKey) {
        const hash = buffer.Buffer.from(serverHash, 'hex');
        const privateKeyBuffer = buffer.Buffer.from(privateKey, 'hex');
        const { v, r, s } = ethereumjsUtil.ecsign(hash, privateKeyBuffer);
        const signData = {
            hash: serverHash,
            sigR: r.toString('hex'),
            sigS: s.toString('hex'),
            sigV: v
        };
        return signData;
    }
}

/**
 * Storage engine to save, update, get and delete files based on the injected engine
 */
class StorageEngine {
    /**
     * Create new container and inject storage engine
     * @param {constructor<unknown>} engine - Storage engine type
     */
    constructor(engine) {
        const childContainer = tsyringe.container.createChildContainer();
        if (engine) {
            childContainer.register('Engine', { useClass: engine });
        }
        else {
            childContainer.register('Engine', { useClass: IPFSEngine });
        }
        this.storageEngine = childContainer.resolve(Storage$1);
    }
    /**
     * Get storage engine instance
     * @returns {IStorageEngine} return storage engine instance
     */
    getStorageEngine() {
        return this.storageEngine;
    }
}

/**
 * This class is used to interact with the block chain using web3js implementation
 */
let Web3Provider$1 = class Web3Provider {
    /**
     * Constructor that initializes the class instance with the provider and configuration.
     *
     * @param {any} provider this is the provider config
     * @param {IInteractionConfig} interactionConfig This is the configuration provider
     */
    constructor(provider, interactionConfig) {
        this.provider = new Web3(provider);
        this.interactionConfig = interactionConfig;
    }
    /**
     * This function returns the contract methods.
     *
     * @param {string} interactionType contract name
     * @returns {any} contract methods
     */
    getMethods(interactionType) {
        if (interactionType.trim().length === 0 || interactionType.trim() === '')
            throw new Error('Please pass the contract name to interact.');
        let abi;
        let address = '';
        if (interactionType.trim().toLowerCase() === 'consent') {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        }
        else if (interactionType.trim().toLowerCase() === 'access') {
            abi = this.interactionConfig.access.abi;
            address = this.interactionConfig.access.address;
        }
        else if (interactionType.trim().toUpperCase() === 'IPFS') {
            abi = this.interactionConfig.ipfs.abi;
            address = this.interactionConfig.ipfs.address;
        }
        else {
            throw new Error('This contract doesn\'t exist.');
        }
        const contract = new this.provider.eth.Contract(abi, address);
        return contract.methods;
    }
    /**
     * This function use the contract method.
     *
     * @param {any} contract This is the contract.
     * @param {IdentityManager} identity This is the identity to interact with the block chain
     * @param {IContractActions} options This is the actions to do in the block chain
     * @param {any} params Extra parameters
     * @returns {any} Return the result of the block chain transaction
     */
    async useContractMethod(contract, identity, options, ...params) {
        if (options.action.trim().toLowerCase() === 'call') {
            return new Promise((resolve, reject) => {
                contract[options.methodName](...params).call({ from: identity.address }, function (error, result) {
                    if (!error)
                        resolve(result);
                    else
                        reject(error);
                });
            });
        }
        else if (options.action.trim().toLowerCase() === 'send') {
            const transaction = contract[options.methodName](...params);
            const receipt = await this.signTransaction(transaction, identity);
            return receipt;
        }
        else {
            throw new Error('Invalid action, please select (send or call)');
        }
    }
    /**
     * This function sign the transaction with the identity passed as a parameter.
     * @param {any} transaction this is the transaction object
     * @param {IdentityManager} identity This is the identity to sign the transaction
     * @returns {Promise<any>} return the transaction receipt
     */
    async signTransaction(transaction, identity) {
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: await transaction.estimateGas({ from: identity.address }),
            gasPrice: this.provider.utils.toHex(this.provider.utils.toWei('30', 'gwei'))
        };
        const signed = await this.provider.eth.accounts.signTransaction(options, identity.privateKey);
        const receipt = await this.provider.eth.sendSignedTransaction(signed.rawTransaction);
        return receipt;
    }
};
Web3Provider$1 = __decorate([
    tsyringe.injectable(),
    __param(0, tsyringe.inject("Provider")),
    __param(1, tsyringe.inject("Config")),
    __metadata("design:paramtypes", [Object, Object])
], Web3Provider$1);
var Web3Provider$2 = Web3Provider$1;

/**
 * This class is used to manage the data in memory
 */
let MemoryCacheEngine = class MemoryCacheEngine {
    /**
     * This constructor starts the memoryCache
     */
    constructor() {
        this.data = new Map();
    }
    /**
     * This function returns the value in memory whose key is equal
     * to the key passed as a function parameter.
     *
     * @param {string} key the key in the map
     * @returns {string |number | undefined} the value of the key
     */
    get(key) {
        if (key.trim().length === 0 || key.trim() === '')
            throw new Error('Error: Invalid key');
        const value = this.data.get(key);
        return value;
    }
    /**
     * This function adds or update a new value with reference
     * to the key passed as parameter.
     *
     * @param {string} key the identifier
     * @param {string} value the value
     */
    set(key, value) {
        if (key.trim().length === 0 || key.trim() === '')
            throw new Error('Error: Invalid key');
        if (typeof value === 'string' && (value.trim().length === 0 || value.trim() === ''))
            throw new Error('Error: Empty value');
        this.data.set(key.trim(), typeof value === 'string' ? value.trim() : value);
    }
    /**
     * This function deletes the value where the key is equal to the key passed in parameter
     * @param {string} key The key to be used to delete the value.
     */
    delete(key) {
        if (key.trim().length === 0 || key.trim() === '')
            throw new Error('Error: Invalid key');
        this.data.delete(key.trim());
    }
    /**
     * This function clear the memory cache.
     */
    clear() {
        this.data.clear();
    }
};
MemoryCacheEngine = __decorate([
    tsyringe.injectable(),
    __metadata("design:paramtypes", [])
], MemoryCacheEngine);
var MemoryCacheEngine$1 = MemoryCacheEngine;

/**
 * This class is used to manage the data in localstorage
 */
class LocalStorageCacheEngine {
    /**
     * This function returns the value in memory whose key is equal
     * to the key passed as a function parameter.
     *
     * @param {string} key the key in the map
     * @returns {string |number | undefined} the value of the key
     */
    get(key) {
        const value = JSON.parse(localStorage.getItem(key));
        return value;
    }
    /**
     * This function adds or update a new value with reference
     * to the key passed as parameter.
     *
     * @param {string} key the identifier
     * @param {string} value the value
     */
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    /**
     * This function deletes the value where the key is equal to the key passed in parameter
     * @param {string} key The key to be used to delete the value.
     */
    delete(key) {
        localStorage.removeItem(key);
    }
    /**
     * This function clear localStorage
     */
    clear() {
        localStorage.clear();
    }
}

tsyringe.container.register('memory', MemoryCacheEngine$1);
tsyringe.container.register('localStorage', LocalStorageCacheEngine);
/**
 * The NonceManager class is used to manage the nonce value
 * when the user uses web3 transactions
 */
class NonceManager {
    /**
     * This constructor starts the instance with the cacheEngine
     * option and a nonce value passed as parameters.
     *
     * @param {string} cacheEngine cacheEngine option
     * @param {number} nonce nonce value
     */
    constructor(cacheEngine, nonce) {
        this.cacheEngine = tsyringe.container.resolve(cacheEngine);
        this.cacheEngine.set('nonce', nonce);
    }
    /**
     * This function returns the current value of the nonce.
     *
     * @returns {number} nonce.
     */
    get() {
        return Number(this.cacheEngine.get('nonce'));
    }
    /**
     * This function save a new nonce value.
     *
     * @param {number} nonce new value of nonce variable
     */
    save(nonce) {
        this.cacheEngine.set('nonce', nonce);
    }
}

/* eslint-disable  @typescript-eslint/no-explicit-any */
/**
 * This class is used to use bowhead-network and web3js library
 *
 */
let Web3ProviderBowhead = class Web3ProviderBowhead {
    /**
     * Constructor that initializes the class instance with the provider and configuration.
     *
     * @param {any} provider this is the provider config
     * @param {IInteractionConfig} interactionConfig This is the configuration provider
     */
    constructor(provider, interactionConfig) {
        this.provider = new Web3Bowhead__namespace(new Web3Bowhead__namespace.providers.HttpProvider(provider));
        this.interactionConfig = interactionConfig;
        this.nonceManager = new NonceManager('cache', 0);
    }
    /**
     * This function returns the contract methods.
     *
     * @param {string} interactionType contract name
     * @returns {any} contract methods
     */
    getMethods(interactionType) {
        let abi;
        let address = '';
        if (interactionType.trim().toLowerCase() === 'consent') {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        }
        else if (interactionType.trim().toLowerCase() === 'access') {
            abi = this.interactionConfig.access.abi;
            address = this.interactionConfig.access.address;
        }
        else {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        }
        //eslint-disable-next-line spellcheck/spell-checker
        const contract = new this.provider.aht.contract(abi).at(address);
        return contract;
    }
    /**
     * This function use the contract method.
     *
     * @param {any} contract This is the contract.
     * @param {IdentityManager} identity This is the identity to interact with the block chain
     * @param {IContractActions} options This is the actions to do in the block chain
     * @param {any} params Extra parameters
     * @returns {any} Return the result of the block chain transaction
     */
    async useContractMethod(contract, identity, options, ...params) {
        try {
            if (options.action.trim() === 'send') {
                const nonce = await this.getNonce(identity.address);
                this.nonceManager.save(nonce > this.nonceManager.get() ? nonce : this.nonceManager.get());
                //eslint-disable-next-line spellcheck/spell-checker
                const rawTx = {
                    'to': FactoryWeb3Interaction.getInstance().config.consent.address,
                    'nonce': this.provider.toHex(this.nonceManager.get()),
                    'gasPrice': 0,
                    'gasLimit': 50000000,
                    'value': '0x0',
                    'data': contract[options.methodName].getData.apply(contract, params),
                    'chainId': FactoryWeb3Interaction.getInstance().config.chainId,
                };
                //eslint-disable-next-line spellcheck/spell-checker
                const bufferTransaction = await this.signTransaction(rawTx, identity);
                const hash = await this.sendSignedTransaction(bufferTransaction);
                const result = await this.getTransactionReceipt(hash);
                this.nonceManager.save(this.nonceManager.get() + 1);
                return result;
            }
            else {
                const fn = contract[options.methodName].bind(contract, ...params, { from: identity.address });
                //eslint-disable-next-line spellcheck/spell-checker
                const result = await this.promersify(fn);
                return result;
            }
        }
        catch (__error) {
            return false;
        }
    }
    /**
     * This function return the nonce value
     * @param {string} userAddress this method return the user nonce
     * @returns {Promise<number>} returns the nonce value
     */
    getNonce(userAddress) {
        return new Promise((resolve, reject) => {
            //eslint-disable-next-line spellcheck/spell-checker
            this.provider.aht.getTransactionCount(userAddress, (err, nonce) => {
                if (err) {
                    reject({
                        'status': 500,
                        //eslint-disable-next-line spellcheck/spell-checker
                        'message': 'Blockchain error: calculating the nonce',
                        'systemMessage': err,
                    });
                    return;
                }
                resolve(nonce);
            });
        });
    }
    /**
     * This function sign the transaction using the identity passed as a parameter.
     * @param {any} transaction the transaction object
     * @param {IdentityManager} identity the identity to sign the transaction.
     * @returns {Promise<any>} the transaction hash in buffer object.
     */
    async signTransaction(transaction, identity) {
        const customCommon = Common.forCustomChain(
        //eslint-disable-next-line spellcheck/spell-checker
        'mainnet', {
            //eslint-disable-next-line spellcheck/spell-checker
            'name': 'aht',
            'chainId': transaction.chainId,
        }, 
        //eslint-disable-next-line spellcheck/spell-checker
        'petersburg');
        //eslint-disable-next-line spellcheck/spell-checker
        const tx = new ethereumjsTx.Transaction(transaction, { 'common': customCommon, });
        //eslint-disable-next-line spellcheck/spell-checker
        tx.sign(Buffer.from(identity.privateKey.substring(2, identity.privateKey.length), 'hex'));
        //eslint-disable-next-line spellcheck/spell-checker
        return tx.serialize();
    }
    /**
     * This function send a transaction signed
     * @param {Buffer} tx this is the buffer result
     * @returns {Promise<string>} return the hash of the transaction
     */
    sendSignedTransaction(tx) {
        return new Promise((resolve, reject) => {
            //eslint-disable-next-line spellcheck/spell-checker
            this.provider.aht.sendRawTransaction('0x' + tx.toString('hex'), (err, hash) => {
                if (err) {
                    reject({
                        'status': 500,
                        //eslint-disable-next-line spellcheck/spell-checker
                        'message': 'Blockchain Error: sending transaction',
                        'systemMessage': err,
                    });
                }
                resolve(hash);
            });
        });
    }
    /**
     * This function return the transaction receipt using the transaction hash passed as a parameter.
     *
     * @param {string} txHash Transaction hash
     * @returns {Promise<any>} return the transaction receipt
     */
    getTransactionReceipt(txHash) {
        return new Promise((resolve, reject) => {
            //eslint-disable-next-line spellcheck/spell-checker
            this.provider.aht.getTransactionReceipt(txHash, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    /**
     * This functions return a promise with the return of the callback function
     * @param {Function} fn callback tu run
     * @returns {Promise<any>} The result of the callback in a promise
     */
    promersify(fn) {
        return new Promise((resolve, reject) => {
            fn((err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
};
Web3ProviderBowhead = __decorate([
    tsyringe.injectable(),
    __param(0, tsyringe.inject("Provider")),
    __param(1, tsyringe.inject("Config")),
    __metadata("design:paramtypes", [Object, Object])
], Web3ProviderBowhead);
var Web3ProviderBowhead$1 = Web3ProviderBowhead;

/**
 * This class is used to create Web3Interactions
 */
class FactoryWeb3Interaction {
    /**
     * Constructor that initializes the instance of the class
     * by setting the 2 providers of the library
     */
    constructor() {
        this.web3Providers = [
            { name: 'web3', option: Web3Provider$2 },
            { name: 'bowhead', option: Web3ProviderBowhead$1 }
        ];
    }
    ;
    /**
     * This method return a instance of FactoryWeb3Interaction
     * @returns {FactoryWeb3Interaction} instance of this clase.
     */
    static getInstance() {
        if (!FactoryWeb3Interaction.instance) {
            this.instance = new FactoryWeb3Interaction();
        }
        return this.instance;
    }
    /**
     * This method set a new configuration to use in the interactions object.
     * @param {IInteractionConfig} config new configuration.
     */
    setConfig(config) {
        this.config = config;
    }
    /**
     * This method add a new Web3Provider implementation
     * @param {IOption} option implementation options
     */
    setOptionWeb3Provider(option) {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionWeb3Provider = this.web3Providers.find(optionAux => optionAux.name === option.name);
        if (optionWeb3Provider) {
            this.web3Providers.map(optionAux => optionAux.name === optionWeb3Provider.name ? optionWeb3Provider : optionAux);
        }
        else {
            this.web3Providers.push(option);
        }
    }
    /**
     * This method generate the a type of interaction with the parameter passed as a parameter..
     * @param {string} providerType Type of provider.
     * @returns {IWeb3Provider} a new Web3Provider implementation
     */
    generateWeb3Provider(providerType) {
        if (providerType.trim().length === 0 || providerType.trim() === '') {
            throw new Error('The name must have at least one character');
        }
        const web3Provider = this.web3Providers.find(option => option.name.trim().toLowerCase() === providerType.trim().toLowerCase());
        if (!web3Provider)
            throw new Error('The web3 provider type doesn\'t exist');
        tsyringe.container.register('Provider', { useValue: this.config.provider });
        tsyringe.container.register('Config', { useValue: this.config });
        const provider = tsyringe.container.resolve(web3Provider.option);
        return provider;
    }
}

/**
 *
 * This class is the implementation of IAccessInteraction interface,
 * this class is used to communicate with Access smart contract.
 *
 */
let AccessInteraction = class AccessInteraction {
    constructor() {
        this.provider = FactoryWeb3Interaction.getInstance().generateWeb3Provider('web3');
    }
    /**
     * This function gives access by making use of the values passed as parameters.
     *
     * @param {string} resource This parameter is the resource to be shared.
     * @param {string} consentId This parameter is the id of the consent.
     * @param {string} accounts This parameter is the accounts to give access.
     * @param {string} resourceName This parameter is the resource name.
     * @param {string} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} Return the trasaction address.
     */
    async giveAccess(resource, consentId, accounts, resourceName, identity) {
        if (resource.trim() === '' || resource.trim().length === 0)
            throw new Error('The resource must have at least one character');
        if (consentId.trim() === '' || consentId.trim().length === 0)
            throw new Error('The consentID must have at least one character');
        if (accounts.length === 0)
            throw new Error('Accounts must have at least one element');
        const contract = this.provider.getMethods('access');
        const options = {
            action: 'send',
            methodName: 'giveAccess'
        };
        const result = await this.provider.useContractMethod(contract, identity, options, resource, Web3.utils.fromAscii(consentId), accounts, Web3.utils.fromAscii(resourceName));
        return result.status;
    }
    /**
     * This function check the access in the resource using the consent id and the user address.
     *
     * @param {string} resource This parameter is the resource to be checked.
     * @param {string} consentId This parameter is the id of the consent to be checked.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} Return if the user has access in this consent.
     */
    async checkAccess(resource, consentId, identity) {
        if (resource.trim() === '' || resource.trim().length === 0)
            throw new Error('The resource must have at least one character');
        if (consentId.trim() === '' || consentId.trim().length === 0)
            throw new Error('The consentID must have at least one character');
        const contract = this.provider.getMethods('access');
        const options = {
            action: 'call',
            methodName: 'checkAccess'
        };
        return await this.provider.useContractMethod(contract, identity, options, resource, Web3.utils.fromAscii(consentId));
    }
    /**
     * This function check the resource and it's state.
     *
     * @param {string} consentId This parameter is the resource to be returned.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<IAccessResource>} Return addres and state of the user in this consent.
     */
    async getResourceByConsent(consentId, identity) {
        if (consentId.trim() === '' || consentId.trim().length === 0)
            throw new Error('The consentID must have at least one character');
        const contract = this.provider.getMethods('access');
        const options = {
            action: 'call',
            methodName: 'getResourceByConsent'
        };
        return this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId));
    }
};
AccessInteraction = __decorate([
    tsyringe.injectable()
], AccessInteraction);
var AccessInteraction$1 = AccessInteraction;

/**
 * This class represent the implementation of IConsentInteraction interface,
 * this class is used to interact with the consent smart contract.
 */
let ConsentInteraction = class ConsentInteraction {
    constructor() {
        this.provider = FactoryWeb3Interaction.getInstance().generateWeb3Provider('web3');
    }
    /**
     * This function saves a consent with the information passed as parameters.
     *
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} return the address of the transaction.
     */
    async saveConsent(consentId, identity) {
        if (consentId.trim() === '' || consentId.trim().length === 0)
            throw new Error('contentID must have at least 1 character');
        const contract = this.provider.getMethods('consent');
        const options = {
            action: 'send',
            methodName: 'updateConsent'
        };
        const result = await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId), true);
        return result.status;
    }
    /**
     * This function cancel a consent based in the consentID passed in the parameter.
     *
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>} return the address of the transaction.
     */
    async cancelConsent(consentId, identity) {
        if (consentId.trim() === '' || consentId.trim().length === 0)
            throw new Error('contentID must have at least 1 character');
        const contract = this.provider.getMethods('consent');
        const options = {
            action: 'send',
            methodName: 'updateConsent'
        };
        const result = await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId), false);
        return result.status;
    }
    /**
     * This function return the consent status based in the consentID passed in the parameter.
     *
     * @param {string} consentId This parameters is the consentID to indentify the consent.
     * @param {string} owner This parameter is the owner addres.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} return the consent status.
     */
    async getConsentById(consentId, owner, identity) {
        if (consentId.trim() === '' || consentId.trim().length === 0)
            throw new Error('contentID must have at least 1 character');
        if (owner.trim() === '' || owner.trim().length === 0)
            throw new Error('Owner must have at least 1 character');
        if (!owner.trim().includes('0x'))
            throw new Error('Invalid owner, the string with has a correct format.');
        const contract = this.provider.getMethods('consent');
        const options = {
            action: 'call',
            methodName: 'getConsent'
        };
        return await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId), owner);
    }
    /**
     * This funtion add a key in a consent based in the consentID in the case if the consent
     * has already been acepted.
     *
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {string} addressConsent This parameter is the adressConsent to indentify the consent.
     * @param {string} key  This parameter is the key to be added in the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<string>}  return the address of the transaction.
     */
    async addKey(consentId, addressConsent, key, identity) {
        if (consentId.trim() === '' || consentId.trim().length === 0)
            throw new Error('contentID must have at least 1 character');
        if (addressConsent.trim() === '' || addressConsent.trim().length === 0)
            throw new Error('AddressConsent must have at least 1 character');
        if (!addressConsent.trim().includes('0x'))
            throw new Error('Invalid addressConsent, the string with has a correct format.');
        if (key.trim().length === 0 || key.trim() === '')
            throw new Error('Key must have at least 1 character');
        const contract = this.provider.getMethods('consent');
        const options = {
            action: 'send',
            methodName: 'addPGPKey'
        };
        const result = await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId), addressConsent, key);
        return result.status;
    }
    /**
     * This funtion return the addres's and keys's the consent based in the consentId.
     *
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<IConsentKeys>} return the addres's and keys's
     */
    async getKeys(consentId, identity) {
        if (consentId.trim() === '' || consentId.trim().length === 0)
            throw new Error('contentID must have at least 1 character');
        const contract = this.provider.getMethods('consent');
        const options = {
            action: 'call',
            methodName: 'getPGPKeys'
        };
        return await this.provider.useContractMethod(contract, identity, options, Web3.utils.fromAscii(consentId));
    }
};
ConsentInteraction = __decorate([
    tsyringe.injectable()
], ConsentInteraction);
var ConsentInteraction$1 = ConsentInteraction;

/**
 * This class is used to interact with the block-chain by making use
 * of consent and access interaction instances.
 */
let Interaction = class Interaction {
    /**
     * This constructor initializes the intent by injecting a specific
     * implementation of consent, access and IPFS management.
     *
     * @param {IConsentInteraction} consentInteraction This parameter is the implementation of ConsentInteraction.
     * @param {IAccessInteraction} accessInteraction This parameter is the implementation of AccessInteraction.
     * @param {IIPFSManagementInteraction} IPFSManagementInteraction This parameter is the implementation of IPFSManagementInteraction.
     */
    constructor(consentInteraction, accessInteraction, IPFSManagementInteraction) {
        this.accessInteraction = accessInteraction;
        this.consentInteraction = consentInteraction;
        this.IPFSManagementInteraction = IPFSManagementInteraction;
    }
    /**
     * This function set a new URL provider of web 3
     *
     * @param {string} urlProvider This parameter is the url provider.
     */
    setUrlProvider(urlProvider) {
        this.urlProvider = urlProvider;
    }
    /**
     * This function establishes a new identity to
     * perform the operations with the web 3
     *
     * @param {IdentityManager} identity This parameter is the identity that will be used to interact with the web.
     */
    setIdentity(identity) {
        this.identity = identity;
    }
};
Interaction = __decorate([
    tsyringe.injectable(),
    __param(0, tsyringe.inject('ConsentInteraction')),
    __param(1, tsyringe.inject('AccessInteraction')),
    __param(2, tsyringe.inject('IPFSManagementInteraction')),
    __metadata("design:paramtypes", [Object, Object, Object])
], Interaction);
var Interaction$1 = Interaction;

/**
 * This class is used to generate
 */
class FactoryInteraction {
    /**
     *
     */
    constructor() {
        this.optionsConsentInteraction = [{ name: 'clam', option: ConsentInteraction$1 }];
        this.optionsAccessInteraction = [{ name: 'clam', option: AccessInteraction$1 }];
        this.optionsIPFSManagementInteraction = [{ name: 'clam', option: IPFSManagementInteraction$1 }];
    }
    /**
     * This function sets a new implementation of ConsentInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionConsentInteraction(option) {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionConsentExist = this.optionsConsentInteraction.find(optionAux => optionAux.name === option.name);
        if (optionConsentExist) {
            throw new Error('This option already exists.');
        }
        this.optionsConsentInteraction.push(option);
    }
    /**
     * This function sets a new implementation of AccessInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionAccessInteraction(option) {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionAccessExist = this.optionsAccessInteraction.find(optionAux => optionAux.name === option.name);
        if (optionAccessExist) {
            throw new Error('This option already exists.');
        }
        this.optionsAccessInteraction.push(option);
    }
    /**
     * This function sets a new implementation of IPFSManagementInteraction.
     *
     * @param {IOption} option This parameter contains the name and class of the new implementation.
     */
    setOptionsIPFSManagementInteraction(option) {
        if (option.name.trim() === '' && option.name.trim().length === 0) {
            throw new Error('The name must have at least one character');
        }
        const optionIPFSManagementExist = this.optionsIPFSManagementInteraction.find(optionAux => optionAux.name === option.name);
        if (optionIPFSManagementExist) {
            throw new Error('This option already exists.');
        }
        this.optionsIPFSManagementInteraction.push(option);
    }
    /**
     * This function generate a new instance of Interaction class using the implementations
     * passed in the parameter.
     *
     * @param {string} consentType This parameter is the option of consentInteraction implementation.
     * @param {string} accessType This parameter is the option of accessInteraction Implementation.
     * @param {string} IPFSManagementType This parameter is the option of IPFSManagementInteraction Implementation.
     * @returns {Interaction} return a new instance of Interaction class.
     */
    generateInteraction(consentType, accessType, IPFSManagementType) {
        if (consentType.trim() === '' && consentType.trim().length === 0) {
            throw new Error('The consent implementation name must have a minimum of one character');
        }
        if (accessType.trim() === '' && accessType.trim().length === 0) {
            throw new Error('The access implementation name must have a minimum of one character');
        }
        if (IPFSManagementType.trim() === '' && IPFSManagementType.trim().length === 0) {
            throw new Error('The IPFS management implementation name must have a minimum of one character');
        }
        const consent = this.optionsConsentInteraction.find(option => option.name.toLowerCase() === consentType.toLowerCase());
        const access = this.optionsAccessInteraction.find(option => option.name.toLowerCase() === accessType.toLowerCase());
        const IPFSManagement = this.optionsIPFSManagementInteraction.find(option => option.name.toLowerCase() === IPFSManagementType.toLowerCase());
        if (!consent) {
            throw new Error('The consentInteraction type doesn\'t exist');
        }
        if (!access) {
            throw new Error('The accessInteraction type doesn\'t exist');
        }
        if (!IPFSManagement) {
            throw new Error('The IPFSManagementInteraction type doesn\'t exist');
        }
        tsyringe.container.register('ConsentInteraction', consent.option);
        tsyringe.container.register('AccessInteraction', access.option);
        tsyringe.container.register('IPFSManagementInteraction', IPFSManagement.option);
        const interaction = tsyringe.container.resolve(Interaction$1);
        return interaction;
    }
}

/**
 * Implementation of IIPFSManagementInteraction interface
 * Interact with the IPFS management contract
 */
let IPFSManagementInteraction = class IPFSManagementInteraction {
    constructor() {
        this.provider = FactoryWeb3Interaction.getInstance().generateWeb3Provider('web3');
    }
    /**
     * Add file to IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {string} fileName - File name
     * @param {IdentityManager} identity - Identity of the file owner
     * @returns {void}
     */
    async addFile(fileHash, fileName, identity) {
        if (fileHash.trim() === '' || fileHash.trim().length === 0)
            throw new Error('fileHash must have at least 1 character');
        if (fileName.trim() === '' || fileName.trim().length === 0)
            throw new Error('fileName must have at least 1 character');
        const contract = this.provider.getMethods('IPFS');
        const options = {
            action: 'send',
            methodName: 'addFile'
        };
        await this.provider.useContractMethod(contract, identity, options, fileHash, Web3.utils.fromAscii(fileName));
        return;
    }
    /**
     * Remove file from IPFS management contract
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - Identity of the file owner
     * @returns {void}
     */
    async removeFile(fileHash, identity) {
        if (fileHash.trim() === '' || fileHash.trim().length === 0)
            throw new Error('fileHash must have at least 1 character');
        const contract = this.provider.getMethods('IPFS');
        const options = {
            action: 'send',
            methodName: 'removeFile'
        };
        await this.provider.useContractMethod(contract, identity, options, fileHash);
        return;
    }
    /**
     * Check if the user can access to the file
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if has access, false if not
     */
    async checkAccess(fileHash, identity) {
        if (fileHash.trim() === '' || fileHash.trim().length === 0)
            throw new Error('fileHash must have at least 1 character');
        const contract = this.provider.getMethods('IPFS');
        const options = {
            action: 'call',
            methodName: 'checkAccess'
        };
        const result = await this.provider.useContractMethod(contract, identity, options, identity.address, fileHash);
        return result;
    }
    /**
     * Check if the file is available
     * @param {string} fileHash - File identifier or location
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<boolean>} returns true if is available, false if not
     */
    async fileIsAvailable(fileHash, identity) {
        if (fileHash.trim() === '' || fileHash.trim().length === 0)
            throw new Error('fileHash must have at least 1 character');
        const contract = this.provider.getMethods('IPFS');
        const options = {
            action: 'call',
            methodName: 'fileIsAvailable'
        };
        const result = await this.provider.useContractMethod(contract, identity, options, identity.address, fileHash);
        return result;
    }
    /**
     * Get list of user files
     * @param {IdentityManager} identity - User identity
     * @returns {Promise<IIpfsManagementFiles>} returns file list
     */
    async getFiles(identity) {
        const contract = this.provider.getMethods('IPFS');
        const options = {
            action: 'call',
            methodName: 'getFiles'
        };
        const result = await this.provider.useContractMethod(contract, identity, options, identity.address);
        return result;
    }
};
IPFSManagementInteraction = __decorate([
    tsyringe.injectable()
], IPFSManagementInteraction);
var IPFSManagementInteraction$1 = IPFSManagementInteraction;

/**
 * This class is used to contain the information and configuration
 * to perform interaction with web 3 and contracts.
 */
class Web3Provider {
    /**
     * Empty constructor
     */
    constructor() {
    }
    /**
     * This function returns the instance of the class using the sigleton pattern.
     *
     * @returns {Web3Provider} return a instance of Web3Provider.
     */
    static getInstance() {
        if (!Web3Provider.instance) {
            Web3Provider.instance = new Web3Provider();
        }
        return this.instance;
    }
    /**
     * This function set the configuration to connect with the blockchain.
     *
     * @param {Web3} web3Object This parameter this parameter Web3Provider.
     * @param {IInteractionConfig} interactionConfig This parameter is the interaction configuration.
     */
    setConfig(web3Object, interactionConfig) {
        this.web3Object = web3Object;
        this.interactionConfig = interactionConfig;
    }
    /**
     * This function return a new Web3 instance.
     *
     * @returns {Web3} return a instance of Web3 using the configuration.
     */
    getProvider() {
        return this.web3Object;
    }
}

/**
 * Document sharing, allow save encrypted files and sharing them with another users.
 */
let DocumentSharing = class DocumentSharing {
    /**
     * Document sharing constructor
     * Using to set storage engine instance
     * @param {IStorageEngine} instance - Storage engine instance
     */
    constructor(instance) {
        this.storageEngine = instance;
    }
    /**
     * Save file encrypted with AES on storage engine
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File to save and additional parameters
     * @returns {string} returns the file identifier or location
     */
    async saveFile(identity, options) {
        const body = options;
        if (!body.file)
            throw new Error('File parameter is missing');
        const consentApproved = await body.contractInteraction.consentInteraction.getConsentById(body.consentId, identity.address, identity);
        if (!consentApproved)
            throw new Error('Consent is not approved');
        const fileEncrypted = await identity.encryptionLayer.encryptData(identity.privateKey, body.file || '');
        const data = {
            file: fileEncrypted,
            address: identity.address,
            fileName: body.fileName,
            keepOriginalName: body.keepOriginalName || false
        };
        const cid = await this.storageEngine.saveFile(data);
        return cid;
    }
    /**
     * Get file encrypted with AES
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file in base64
     */
    async getFile(identity, options) {
        const info = options;
        if (!info.cid)
            throw new Error('File identifier is missing');
        const params = {
            cid: info.cid,
            address: identity.address
        };
        const file = await this.storageEngine.getFile(params);
        const decodeFile = Buffer.from(file, 'base64').toString('utf8');
        const decryptedFile = identity.encryptionLayer.decryptData(identity.privateKey, decodeFile);
        return decryptedFile;
    }
    /**
     * Update file encrypted with AES on storage engine
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File identifier or location and additional parameters
     */
    async updateFile(identity, options) {
        const body = options;
        if (!body.file)
            throw new Error('File parameter is missing');
        const fileEncrypted = await identity.encryptionLayer.encryptData(identity.privateKey, body.file);
        const data = {
            file: fileEncrypted,
            address: identity.address,
            cid: body.cid,
            privateKey: identity.privateKey
        };
        await this.storageEngine.updateFile(data);
    }
    /**
     * Save file shared on storage engine, it is encrypted with PGP
     * @param {IdentityManager} identity - File owner identity
     * @param {object} options - File to save and additional parameters
     * @param {string} userIds - PGP public keys of users authorized to view the shared file
     * @returns {string} returns the file identifier or location
     */
    async sharedFile(identity, options, userIds) {
        const body = options;
        if (!body.file)
            throw new Error('File parameter is missing');
        const consentApproved = await body.contractInteraction.consentInteraction.getConsentById(body.consentId, identity.address, identity);
        if (!consentApproved)
            throw new Error('Consent is not approved');
        userIds += `,${identity.publicKeySpecial}`;
        const fileEncrypted = await identity.encryptionLayer.encryptData(userIds, body.file);
        const data = {
            file: fileEncrypted,
            address: identity.address,
            fileName: body.fileName,
            keepOriginalName: body.keepOriginalName || false
        };
        const cid = await this.storageEngine.saveFile(data);
        return cid;
    }
    /**
     * Get file shared encrypted with PGP
     * @param {IdentityManager} identity - User identity that is allowed to get file
     * @param {object} options - File identifier or location and additional parameters
     * @returns {string} returns the file in base64
     */
    async getSharedFile(identity, options) {
        const info = options;
        if (!info.cid)
            throw new Error('File identifier is missing');
        const access = await info.contractInteraction.accessInteraction.checkAccess(info.cid, info.consentId, identity);
        if (!access)
            throw new Error('You do not have access to the resource');
        const params = {
            cid: info.cid,
            address: info.owner || ''
        };
        const file = await this.storageEngine.getFile(params);
        const decodeFile = Buffer.from(file, 'base64').toString('utf8');
        const decryptedFile = await identity.encryptionLayer.decryptData(identity.privateKeySpecial, decodeFile);
        return decryptedFile;
    }
};
DocumentSharing = __decorate([
    tsyringe.injectable(),
    __metadata("design:paramtypes", [Object])
], DocumentSharing);
var DocumentSharing$1 = DocumentSharing;

exports.DocumentSharing = DocumentSharing$1;
exports.EncryptionLayerAES = EncryptionLayerAES$1;
exports.EncryptionLayerPGP = EncryptionLayerPGP$1;
exports.FactoryIdentity = FactoryIdentity;
exports.FactoryInteraction = FactoryInteraction;
exports.FactoryWeb3Interaction = FactoryWeb3Interaction;
exports.IdentityManager = IdentityManager$1;
exports.KeysGeneratorPGP = KeysGeneratorPGP$1;
exports.ShareableIdentity = ShareableIdentity;
exports.Storage = Storage$1;
exports.StorageEngine = StorageEngine;
exports.Web3Provider = Web3Provider;
//# sourceMappingURL=clam.cjs.map
