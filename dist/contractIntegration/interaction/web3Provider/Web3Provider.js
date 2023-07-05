"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable  @typescript-eslint/no-explicit-any */
const web3_1 = tslib_1.__importDefault(require("web3"));
//eslint-disable-next-line @typescript-eslint/no-unused-vars
const tsyringe_1 = require("tsyringe");
/**
 * This class is used to interact with the block chain using web3js implementation
 */
let Web3Provider = class Web3Provider {
    /**
     * Constructor that initializes the class instance with the provider and configuration.
     *
     * @param {any} provider this is the provider config
     * @param {IInteractionConfig} interactionConfig This is the configuration provider
     */
    constructor(provider, interactionConfig) {
        this.provider = new web3_1.default(provider);
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
    useContractMethod(contract, identity, options, ...params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                const receipt = yield this.signTransaction(transaction, identity);
                return receipt;
            }
            else {
                throw new Error('Invalid action, please select (send or call)');
            }
        });
    }
    /**
     * This function sign the transaction with the identity passed as a parameter.
     * @param {any} transaction this is the transaction object
     * @param {IdentityManager} identity This is the identity to sign the transaction
     * @returns {Promise<any>} return the transaction receipt
     */
    signTransaction(transaction, identity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const options = {
                to: transaction._parent._address,
                data: transaction.encodeABI(),
                gas: yield transaction.estimateGas({ from: identity.address }),
                gasPrice: this.provider.utils.toHex(this.provider.utils.toWei('30', 'gwei'))
            };
            const signed = yield this.provider.eth.accounts.signTransaction(options, identity.privateKey);
            const receipt = yield this.provider.eth.sendSignedTransaction(signed.rawTransaction);
            return receipt;
        });
    }
};
Web3Provider = tslib_1.__decorate([
    (0, tsyringe_1.injectable)(),
    tslib_1.__param(0, (0, tsyringe_1.inject)("Provider")),
    tslib_1.__param(1, (0, tsyringe_1.inject)("Config")),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], Web3Provider);
exports.default = Web3Provider;
//# sourceMappingURL=Web3Provider.js.map