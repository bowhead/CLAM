import { injectable } from "tsyringe";
import { IAccessInteraction } from ".";

import Web3 from "web3";
import { IdentityManager } from "../../indentityManager";
import Web3Provider from "../interaction/Wbe3Provider";

@injectable()
class AccessInteraction implements IAccessInteraction {
    async giveAccess(resource: string, consentId: string, account: string, identity: IdentityManager): Promise<any> {
        if (resource.trim() === "" || resource.trim().length === 0) throw new Error("The resource must have at least one character");
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("The consentID must have at least one character");
        if (account.trim() === "" || account.trim().length === 0) throw new Error("The account must have at least one character");
        if (!account.trim().includes("0x")) throw new Error("The account format is invalid");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.accessConfig.abi, provider.accessConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            const resourceBytes = Web3.utils.fromAscii(resource);
            const consentIdBytes = Web3.utils.fromAscii(consentId);
            contract.methods.giveAccess(resourceBytes, consentIdBytes, account).send({ gas: '1000000' }, function (error: any, result: any) {
                if (!error) {
                    resolve({ result })
                }
                else {
                    reject(error)
                }
            })
        })
    }
    async revokeAccess(resource: string, consentId: string, account: string, identity: IdentityManager): Promise<any> {

        if (resource.trim() === "" || resource.trim().length === 0) throw new Error("The resource must have at least one character");
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("The consentID must have at least one character");
        if (account.trim() === "" || account.trim().length === 0) throw new Error("The account must have at least one character");
        if (!account.trim().includes("0x")) throw new Error("The account format is invalid");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.accessConfig.abi, provider.accessConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            const resourceBytes = Web3.utils.fromAscii(resource);
            const consentIdBytes = Web3.utils.fromAscii(consentId);
            contract.methods.revokeAccess(resourceBytes, consentIdBytes, account).send({ gas: '1000000' }, function (error: any, result: any) {
                if (!error) {
                    resolve({ result })
                }
                else {
                    reject(error)
                }
            })
        })
    }
    async checkAccess(resource: string, consentId: string, identity: IdentityManager): Promise<any> {
        if (resource.trim() === "" || resource.trim().length === 0) throw new Error("The resource must have at least one character");
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("The consentID must have at least one character");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.accessConfig.abi, provider.accessConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            const resourceBytes = Web3.utils.fromAscii(resource);
            const consentIdBytes = Web3.utils.fromAscii(consentId);
            contract.methods.checkAccess(resourceBytes, consentIdBytes).call(function (error: any, result: any) {
                if (!error) {
                    resolve({ result })
                }
                else {
                    reject(error)
                }
            })
        })
    }
    async getResourceByConsent(consentId: string, identity: IdentityManager): Promise<any> {
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("The consentID must have at least one character");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.accessConfig.abi, provider.accessConfig.address, { from: identity.address });

        return new Promise((resolve, reject) => {
            const consentIdBytes = Web3.utils.fromAscii(consentId);
            contract.methods.getResourceByConsent(consentIdBytes).call(function (error: any, result: any) {
                if (!error) {
                    resolve({ result })
                }
                else {
                    reject(error)
                }
            })
        })
    }

}


export default AccessInteraction;