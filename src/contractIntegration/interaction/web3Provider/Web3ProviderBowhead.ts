const Web3Bowhead = require("bowhead-web3");
import { IdentityManager } from "../../../indentityManager";
import IInteractionConfig from "../IInteractionConfig";
import IWeb3Provider from "./IWeb3Provider";
import { injectable, inject } from "tsyringe";

@injectable()
class Web3ProviderBowhead implements IWeb3Provider {
    private provider: typeof Web3Bowhead;
    private interactionConfig: IInteractionConfig

    constructor(@inject("Provider") provider: any, @inject("Config") interactionConfig: any) {
        this.provider = new Web3Bowhead(provider);
        this.interactionConfig = interactionConfig;
    }
    getMethods(interactionType: string) {
        let abi: any;
        let address: string = "";
        if (interactionType === "consent") {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        } else if (interactionType === "access") {
            abi = this.interactionConfig.access.abi;
            address = this.interactionConfig.access.address;
        } else {
            abi = this.interactionConfig.consent.abi;
            address = this.interactionConfig.consent.address;
        }
        const contract = new this.provider.aht.contract(abi).at(address);
        return contract;
    }

    async callContractMethod(method: Function, identity: IdentityManager) {
        return new Promise((resolve, reject) => {
            method.call({ from: identity.address }, function (error: Error, result: boolean) {
                if (!error) resolve(result);
                else reject(error);
            });
        });
    }

    async signTransaction(transaction: any, identity: IdentityManager): Promise<boolean> {
        console.log(transaction)
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: await transaction.estimateGas({ from: identity.address }),
            gasPrice: this.provider.utils.toHex(this.provider.utils.toWei('30', 'gwei'))
        };
        const signed = await this.provider.aht.sign(options, identity.privateKey);
        const receipt = await this.provider.aht.sendSignedTransaction(signed.rawTransaction as string);
        return receipt.status;
    }


}

export default Web3ProviderBowhead;