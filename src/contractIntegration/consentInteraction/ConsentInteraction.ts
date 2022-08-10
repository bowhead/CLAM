import { injectable } from "tsyringe";
import { IConsentInteraction } from ".";
import Web3 from "web3";
import { IdentityManager } from "../../indentityManager";
import Web3Provider from "../interaction/Wbe3Provider";
@injectable()
class ConsentInteraction implements IConsentInteraction {

    saveConsent(consentId: string, identity: IdentityManager): Promise<any> {
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("contentID must have at least 1 character");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
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
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("contentID must have at least 1 character");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
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
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("contentID must have at least 1 character");
        if (owner.trim() === "" || owner.trim().length === 0) throw new Error("Owner must have at least 1 character");
        if (!owner.trim().includes("0x")) throw new Error("Invalid owner, the string with has a correct format.");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
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
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("contentID must have at least 1 character");
        if (addressConsent.trim() === "" || addressConsent.trim().length === 0) throw new Error("AddressConsent must have at least 1 character");
        if (!addressConsent.trim().includes("0x")) throw new Error("Invalid addressConsent, the string with has a correct format.");
        if (key.trim().length === 0 || key.trim() === "") throw new Error("Key must have at least 1 character");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
        return new Promise((resolve, reject) => {
            contract.methods.addPGPKey(Web3.utils.fromAscii(consentId), addressConsent, key).send({ gas: '1000000' }, function (error: any, result: any) {
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
        if (consentId.trim() === "" || consentId.trim().length === 0) throw new Error("contentID must have at least 1 character");

        const objWeb3 = Web3Provider.getInstance().getProvider();
        const provider = Web3Provider.getInstance();
        const contract = new objWeb3.eth.Contract(provider.consentConfig.abi, provider.consentConfig.address, { from: identity.address });
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

export default ConsentInteraction;