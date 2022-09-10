const Web3Bowhead = require("bowhead-web3");
import { IdentityManager } from "../../../indentityManager";
import IInteractionConfig from "../IInteractionConfig";
import IWeb3Provider from "./IWeb3Provider";
import { injectable, inject } from "tsyringe";
import FactoryWeb3Interaction from "./FactoryWeb3Interaction";
import IContractActions from "./IContractActions";
import NonceManager from "./nonceManager/NonceManager";
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;

@injectable()
class Web3ProviderBowhead implements IWeb3Provider {
    private provider: typeof Web3Bowhead;
    private nonceManager: NonceManager;
    private interactionConfig: IInteractionConfig;

    constructor(@inject("Provider") provider: any, @inject("Config") interactionConfig: any) {
        this.provider = new Web3Bowhead(new Web3Bowhead.providers.HttpProvider(provider));
        this.interactionConfig = interactionConfig;
        this.nonceManager = new NonceManager("cache", 0);
    }
    
    getMethods(interactionType: string) {
        let abi: any;
        let address: string = "";
        if (interactionType.trim().toLowerCase() === "consent") {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        } else if (interactionType.trim().toLowerCase() === "access") {
            abi = this.interactionConfig.access.abi;
            address = this.interactionConfig.access.address;
        } else {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        }
        const contract = new this.provider.aht.contract(abi).at(address);
        return contract;
    }

    async useContractMethod(contract: any, identity: IdentityManager, options: IContractActions, ...params: any[]) {
        try {
            if (options.action.trim() === 'send') {
                const nonce: number = await this.getNonce(identity.address);
                this.nonceManager.save(nonce > this.nonceManager.get() ? nonce : this.nonceManager.get());
                const rawTx = {
                    'to': FactoryWeb3Interaction.getInstance().config.consent.address,
                    'nonce': this.provider.toHex(this.nonceManager.get()),
                    'gasPrice': 0,
                    'gasLimit': 50000000,
                    'value': '0x0',
                    'data': contract[options.methodName].getData.apply(contract, params),
                    'chainId': FactoryWeb3Interaction.getInstance().config.chainId,
                };
                const bufferTransaction = await this.signTransaction(rawTx, identity);
                const hash = await this.sendSignedTransaction(bufferTransaction);
                const result = await this.getTransactionReceipt(hash);
                this.nonceManager.save(this.nonceManager.get() + 1);
                return result;
            } else {
                let fn = contract[options.methodName].bind(
                    contract,
                    ...params,
                    { from: identity.address }
                )
                let result = await this.promersify(fn);
                return result;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    getNonce(userAddress: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.provider.aht.getTransactionCount(userAddress, (err: Error, nonce: number) => {
                if (err) {
                    reject({
                        'status': 500,
                        'message': 'Blockchain error: calculating the nonce',
                        'systemMessage': err,
                    });
                    return;
                }
                resolve(nonce);
            });
        });
    }

    async signTransaction(transaction: any, identity: IdentityManager): Promise<any> {
        const customCommon = Common.forCustomChain(
            'mainnet',
            {
                'name': 'aht',
                'chainId': transaction.chainId,
            },
            'petersburg',
        );
        let tx = new Tx(transaction, { 'common': customCommon, });
        tx.sign(Buffer.from(identity.privateKey.substring(2, identity.privateKey.length), 'hex'));
        return tx.serialize();
    }

    sendSignedTransaction(tx: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            this.provider.aht.sendRawTransaction('0x' + tx.toString('hex'), (err: Error, hash: string) => {
                if (err) {
                    reject({
                        'status': 500,
                        'message': 'Blockchain Error: sending transaction',
                        'systemMessage': err,
                    });
                }
                resolve(hash);
            });
        });
    }

    getTransactionReceipt(txHash: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.provider.aht.getTransactionReceipt(txHash, (err: Error, result: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

    promersify(fn: Function) {
        return new Promise((resolve, reject) => {
            fn((err: Error, result: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }

}

export default Web3ProviderBowhead;