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
        this.consentAddress = "0x4ce804103f98D14d76873D55ba8dc13B3bB72906";
        this.accessAddress = "0xd7EeA4678B700fB5BA8496C8C1c3B2d6df8Fd384";
        this.consetResourceAddress = "0x7564Ee00E0261e92b61ddf2C75CeF440c089dAB8";

        this.consentABI = ABIConsent.abi;
        this.accessABI = ABIAccess.abi;
        this.consentResourceABI = ABIConsentResource.abi;

        this.urlProvider = "http://localhost:8545"
    }

}

export default SmartContractInfo;




