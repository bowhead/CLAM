import Web3 from "web3";
class Web3Provider {
    public urlProvider: string;
    public consentConfig: {address: string, abi: any}
    public accessConfig: {address: string, abi: any}
    public consentResourceConfig: {address: string, abi: any}
    public static instance: Web3Provider;

    private constructor() {}

    public static getInstance (): Web3Provider{
        if(!Web3Provider.instance){
            Web3Provider.instance = new Web3Provider();
        }
        return this.instance;
    }
    public setConfig (urlProvider: string, consentConfig: any, accessConfig: any,consentResourceConfig: any):void{
        this.urlProvider = urlProvider;
        this.consentConfig = consentConfig;
        this.accessConfig = accessConfig;
        this.consentResourceConfig = consentResourceConfig;
    }
    public getProvider(): Web3{
        const objWeb3 = new Web3(new Web3.providers.HttpProvider(this.urlProvider));
        return objWeb3;
    }
}

export default Web3Provider;