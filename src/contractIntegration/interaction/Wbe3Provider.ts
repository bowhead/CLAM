import Web3 from "web3";
class Web3Provider {
    public urlProvider: string;
    public static instance: Web3Provider;

    private constructor() {}

    public static getInstance (): Web3Provider{
        if(!Web3Provider.instance){
            Web3Provider.instance = new Web3Provider();
        }
        return this.instance;
    }
    public setUrlProvider (urlProvider: string):void{
        this.urlProvider = urlProvider;
    }
    public getProvider(){
        const objWeb3 = new Web3(new Web3.providers.HttpProvider(this.urlProvider));
        return objWeb3;
    }
}

export default Web3Provider;