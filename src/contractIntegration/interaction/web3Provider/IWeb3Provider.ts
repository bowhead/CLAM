import { IdentityManager } from "../../../indentityManager";

interface IWeb3Provider {

    getMethods(interactionType: string): any;
    callContractMethod(method: Function, identity: IdentityManager): Promise<any>;
    signTransaction(transaction: any, identity: IdentityManager): Promise<boolean>;

}

export default IWeb3Provider;