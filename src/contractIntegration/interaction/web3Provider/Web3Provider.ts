import Web3 from "web3";
import { IdentityManager } from "../../../indentityManager";
import IInteractionConfig from "../IInteractionConfig";
import IWeb3Provider from "./IWeb3Provider";
import { injectable, inject } from "tsyringe";
import IContractActions from "./IContractActions";

@injectable()
class Web3Provider implements IWeb3Provider {
    private provider: Web3;
    private interactionConfig: IInteractionConfig

    constructor(@inject("Provider") provider: any, @inject("Config") interactionConfig: any) {
        this.provider = new Web3(provider);
        this.interactionConfig = interactionConfig;
    }

    getMethods(interactionType: string) {
        if (interactionType.trim().length === 0 || interactionType.trim() === '') throw new Error("Please pass the contract name to interact.");
        let abi: any;
        let address: string = "";
        if (interactionType.trim().toLowerCase() === 'consent') {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        } else if (interactionType.trim().toLowerCase() === 'access') {
            abi = this.interactionConfig.access.abi;
            address = this.interactionConfig.access.address;
        } else if (interactionType.trim().toUpperCase() === 'IPFS') {
            abi = this.interactionConfig.ipfs.abi;
            address = this.interactionConfig.ipfs.address;
        } else {
            throw new Error("This contract doesn't exist.");
        }
        const contract = new this.provider.eth.Contract(abi, address);
        return contract.methods;
    }

    async useContractMethod(contract: any, identity: IdentityManager, options: IContractActions, ...params: any[]) {
        if (options.action.trim().toLowerCase() === 'call') {
            return new Promise((resolve, reject) => {
                contract[options.methodName](...params).call({ from: identity.address }, function (error: Error, result: boolean) {
                    if (!error) resolve(result);
                    else reject(error);
                });
            });
        } else if (options.action.trim().toLowerCase() === 'send') {
            const transaction = contract[options.methodName](...params);
            const receipt = await this.signTransaction(transaction, identity);
            return receipt;
        } else {
            throw new Error("Invalid action, please select (send or call)");
        }
    }

    async signTransaction(transaction: any, identity: IdentityManager): Promise<any> {
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: await transaction.estimateGas({ from: identity.address }),
            gasPrice: this.provider.utils.toHex(this.provider.utils.toWei('30', 'gwei'))
        };
        const signed = await this.provider.eth.accounts.signTransaction(options, identity.privateKey);
        const receipt = await this.provider.eth.sendSignedTransaction(signed.rawTransaction as string);
        return receipt;
    }


}

export default Web3Provider;