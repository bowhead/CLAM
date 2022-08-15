/**
 * This class is used to contain the Consent information.
 */
class Consent {
    public consented: boolean;
    public consentDate: Date;
    public address: string;
    public addressConsentIndex: Map<string, number>;
    public publicPGPKeys: Map<string, string>;

    /**
     * Constructor that initializes the class intent with the values passed as parameters.
     * 
     * @param {boolean} consented Parameter that represents the state of the consent.
     * @param {Date} consentDate Parameter that represents the date when the consent was consented.
     * @param {string} address Parameter that represents the address of the consent.
     * @param {Map<string, number>} addressConsentIndex Parameter that represents the address and its index in the consent list.
     * @param {Map<string, string>} publicPGPKeys Parameter that represents the keys that are registered in this consent.
     */
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