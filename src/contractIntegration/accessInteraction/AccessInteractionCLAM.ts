import { injectable } from "tsyringe";
import { IAccessInteraction } from "./";

import Web3 from "web3";
import { IdentityManager } from "../../indentityManager";
import SmartContractInfo from "../utilities/SmartContractInfo";
import Web3Provider from "../interaction/Wbe3Provider";
const contractsInfo: SmartContractInfo = new SmartContractInfo();

@injectable()
class AccessInteractionCLAM implements IAccessInteraction {
    async giveAccess(resource: string, consentId: string, account: string, identity: IdentityManager): Promise<any> {
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.accessABI, contractsInfo.accessAddress, { from: identity.address });

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
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.accessABI, contractsInfo.accessAddress, { from: identity.address });

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
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.accessABI, contractsInfo.accessAddress, { from: identity.address });

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
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.accessABI, contractsInfo.accessAddress, { from: identity.address });

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


export default AccessInteractionCLAM;