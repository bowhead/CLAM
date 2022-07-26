class Consent {
    consented: boolean;
    consentDate: Date;
    address: string;
    addressConsentIndex: Map<string, number>;
    publicPGPKeys: Map<string, string>;

    constructor(
        consented: boolean,
        consentDate: Date,
        address: string,
        addressConsentIndex: Map<string, number>,
        publicPGPKeys: Map<string, string>
    ) {
        this.consented = consented;
        this.consentDate = consentDate;
        this.address = address;
        this.addressConsentIndex = addressConsentIndex;
        this.publicPGPKeys = publicPGPKeys;
    }

}

export default Consent;