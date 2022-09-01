import { IdentityManager } from "../../../indentityManager";

interface IWeb3Provider {

    getMethods(interactionType: string): any;
    signTransaction(transaction: any, identity: IdentityManager): Promise<boolean>;

}

export default IWeb3Provider;