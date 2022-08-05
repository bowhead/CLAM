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
    public constructor(){
        this.consentAddress = "0xb903d7653278218A49ADd55B644EafaD1f38fF54";
        this.accessAddress = "0x6838fB97328aCFa0590A6f4f6CFAc95372e33089";
        this.consetResourceAddress = "0x4ce804103f98D14d76873D55ba8dc13B3bB72906";

        this.consentABI = ABIConsent.abi;
        this.accessABI = ABIAccess.abi;
        this.consentResourceABI = ABIConsentResource.abi;
    }

}

export default SmartContractInfo;




