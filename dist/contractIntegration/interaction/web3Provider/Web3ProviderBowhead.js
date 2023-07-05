"use strict";
/* eslint-disable  @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
//eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Bowhead = require('bowhead-web3');
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
const FactoryWeb3Interaction_1 = tslib_1.__importDefault(require("./FactoryWeb3Interaction"));
const NonceManager_1 = tslib_1.__importDefault(require("./nonceManager/NonceManager"));
//eslint-disable-next-line @typescript-eslint/no-var-requires, spellcheck/spell-checker
const Tx = require('ethereumjs-tx').Transaction;
//eslint-disable-next-line @typescript-eslint/no-var-requires, spellcheck/spell-checker
const Common = require('ethereumjs-common').default;
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
        this.provider = new Web3Bowhead(new Web3Bowhead.providers.HttpProvider(provider));
        this.interactionConfig = interactionConfig;
        this.nonceManager = new NonceManager_1.default('cache', 0);
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
    useContractMethod(contract, identity, options, ...params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                if (options.action.trim() === 'send') {
                    const nonce = yield this.getNonce(identity.address);
                    this.nonceManager.save(nonce > this.nonceManager.get() ? nonce : this.nonceManager.get());
                    //eslint-disable-next-line spellcheck/spell-checker
                    const rawTx = {
                        'to': FactoryWeb3Interaction_1.default.getInstance().config.consent.address,
                        'nonce': this.provider.toHex(this.nonceManager.get()),
                        'gasPrice': 0,
                        'gasLimit': 50000000,
                        'value': '0x0',
                        'data': contract[options.methodName].getData.apply(contract, params),
                        'chainId': FactoryWeb3Interaction_1.default.getInstance().config.chainId,
                    };
                    //eslint-disable-next-line spellcheck/spell-checker
                    const bufferTransaction = yield this.signTransaction(rawTx, identity);
                    const hash = yield this.sendSignedTransaction(bufferTransaction);
                    const result = yield this.getTransactionReceipt(hash);
                    this.nonceManager.save(this.nonceManager.get() + 1);
                    return result;
                }
                else {
                    const fn = contract[options.methodName].bind(contract, ...params, { from: identity.address });
                    //eslint-disable-next-line spellcheck/spell-checker
                    const result = yield this.promersify(fn);
                    return result;
                }
            }
            catch (__error) {
                return false;
            }
        });
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
    signTransaction(transaction, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            const tx = new Tx(transaction, { 'common': customCommon, });
            //eslint-disable-next-line spellcheck/spell-checker
            tx.sign(Buffer.from(identity.privateKey.substring(2, identity.privateKey.length), 'hex'));
            //eslint-disable-next-line spellcheck/spell-checker
            return tx.serialize();
        });
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
Web3ProviderBowhead = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)("Provider")),
    tslib_1.__param(1, (0, tsyringe_1.inject)("Config")),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], Web3ProviderBowhead);
exports.default = Web3ProviderBowhead;
//# sourceMappingURL=Web3ProviderBowhead.js.map