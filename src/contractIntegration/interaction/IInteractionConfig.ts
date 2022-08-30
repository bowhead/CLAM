interface IInteractionConfig {
    consent: { address: string, abi: any },
    access: { address: string, abi: any },
    consentResource: { address: string, abi: any },
    ipfs: { address: string, abi: any },
}

export default IInteractionConfig;