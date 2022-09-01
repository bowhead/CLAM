import Web3 from "web3";
import { IdentityManager } from "../../../indentityManager";
import IInteractionConfig from "../IInteractionConfig";
import IWeb3Provider from "./IWeb3Provider";
import { injectable, inject } from "tsyringe";

@injectable()
class Web3ProviderClam implements IWeb3Provider {
    private provider: Web3;
    private interactionConfig: IInteractionConfig

    constructor(@inject("Provider") provider: any, @inject("Config") interactionConfig: any) {
        this.provider = provider;
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
        const contract = new this.provider.eth.Contract(abi, address);
        return contract.methods;
    }

    async signTransaction(transaction: any, identity: IdentityManager): Promise<boolean> {
        const options = {
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: await transaction.estimateGas({ from: identity.address }),
            gasPrice: this.provider.utils.toHex(this.provider.utils.toWei('30', 'gwei'))
        };
        const signed = await this.provider.eth.accounts.signTransaction(options, identity.privateKey);
        const receipt = await this.provider.eth.sendSignedTransaction(signed.rawTransaction as string);
        return receipt.status;
    }


}

export default Web3ProviderClam;