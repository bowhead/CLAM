class Consent {
    public consented: boolean;
    public consentDate: Date;
    public address: string;
    public addressConsentIndex: Map<string, number>;
    public publicPGPKeys: Map<string, string>;

    public constructor(
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