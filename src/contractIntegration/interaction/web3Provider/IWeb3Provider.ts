/* eslint-disable  @typescript-eslint/no-explicit-any */
import { IdentityManager } from '../../../indentityManager';
import IContractActions from './IContractActions';

interface IWeb3Provider {
    getMethods(interactionType: string): any;
    useContractMethod(contract: any, identity: IdentityManager, options: IContractActions, ...params: any[]): Promise<any>;
    signTransaction(transaction: any, identity: IdentityManager): Promise<any>;
}

export default IWeb3Provider;