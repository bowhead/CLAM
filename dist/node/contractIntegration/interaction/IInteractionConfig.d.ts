import { AbiItem } from 'web3-utils';
interface IInteractionConfig {
    provider: any;
    chainId?: number;
    consent: {
        address: string;
        abi: AbiItem;
    };
    access: {
        address: string;
        abi: AbiItem;
    };
    consentResource: {
        address: string;
        abi: AbiItem;
    };
    ipfs: {
        address: string;
        abi: AbiItem;
    };
}
export default IInteractionConfig;
