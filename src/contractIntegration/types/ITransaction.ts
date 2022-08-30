export interface ITransaction {
    _parent: { _address: string},
    encodeABI(): string,
    estimateGas(info: IEstimateGasParameters): number;
}

interface IEstimateGasParameters {
    from: string;
}