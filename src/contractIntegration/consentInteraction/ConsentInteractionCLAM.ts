import { injectable } from "tsyringe";
import { IConsentInteraction } from "./";
import Web3 from "web3";
import { IdentityManager } from "../../indentityManager";
import SmartContractInfo from "../utilities/SmartContractInfo";
import Web3Provider from "../interaction/Wbe3Provider";
const contractsInfo: SmartContractInfo = new SmartContractInfo();
@injectable()
class ConsentInteractionCLAM implements IConsentInteraction {

    saveConsent(consentId: string, identity: IdentityManager): Promise<any> {
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.consentABI, contractsInfo.consentAddress, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.updateConsent(Web3.utils.fromAscii(consentId), true).send(function (error: any, result: any) {
                if (!error) {
                    resolve({ result })
                }
                else {
                    reject(error)
                }
            })
        })

    }
    async cancelConsent(consentId: string, identity: IdentityManager): Promise<any> {
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.consentABI, contractsInfo.consentAddress, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.updateConsent(Web3.utils.fromAscii(consentId), false).send(function (error: any, result: any) {
                if (!error) {
                    resolve({ result })
                }
                else {
                    reject(error)
                }
            })
        })

    }
    getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<any> {
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.consentABI, contractsInfo.consentAddress, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.getConsent(Web3.utils.fromAscii(consentId), owner).call(function (error: any, result: any) {
                if (!error) {
                    resolve({ result })
                }
                else {
                    reject(error)
                }
            })
        })
    }
    addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<any> {
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.consentABI, contractsInfo.consentAddress, { from: identity.address });

        return new Promise((resolve, reject) => {
            contract.methods.addPGPKey(Web3.utils.fromAscii(consentId), addressConsent, key).call(function (error: any, result: any) {
                if (!error) {
                    resolve({ result })
                }
                else {
                    reject(error)
                }
            })
        })
    }
    getKeys(consentId: string, identity: IdentityManager): Promise<any> {
        const objWeb3 = Web3Provider.getInstance().getProvider();
        const contract = new objWeb3.eth.Contract(contractsInfo.consentABI, contractsInfo.consentAddress, { from: identity.address });

        return new Promise((resolve, reject) => {
            contract.methods.getPGPKeys(Web3.utils.fromAscii(consentId)).call(function (error: any, result: any) {
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

export default ConsentInteractionCLAM;