import ABIConsent from "./Consent.json";
import ABIAccess from "./Access.json";
import ABIConsentResource from "./ConsentResource.json";

class SmartContractInfo{
    public consentAddress: string;
    public consentABI: any;
    public accessAddress: string;
    public accessABI: any;
    public consetResourceAddress: string;
    public consentResourceABI: any;
    public urlProvider:string;
    public constructor(){
        this.consentAddress = "0x859768B0d2ed33eCe914Fd8B6EbcAE5288fb087a";
        this.accessAddress = "0xCDb2d33Ac1910BbfcDB0502Bf0d88A1c3495e967";
        this.consetResourceAddress = "0xd7EeA4678B700fB5BA8496C8C1c3B2d6df8Fd384";

        this.consentABI = ABIConsent.abi;
        this.accessABI = ABIAccess.abi;
        this.consentResourceABI = ABIConsentResource.abi;

        this.urlProvider = "http://localhost:8545"
    }

}

export default SmartContractInfo;




