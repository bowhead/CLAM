"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class is used to contain the Consent information.
 */
class Consent {
    /**
     * Constructor that initializes the class intent with the values passed as parameters.
     *
     * @param {boolean} consented Parameter that represents the state of the consent.
     * @param {Date} consentDate Parameter that represents the date when the consent was consented.
     * @param {string} address Parameter that represents the address of the consent.
     * @param {Map<string, number>} addressConsentIndex Parameter that represents the address and its index in the consent list.
     * @param {Map<string, string>} publicPGPKeys Parameter that represents the keys that are registered in this consent.
     */
    constructor(consented, consentDate, address, addressConsentIndex, publicPGPKeys) {
        this.consented = consented;
        this.consentDate = consentDate;
        this.address = address;
        this.addressConsentIndex = addressConsentIndex;
        this.publicPGPKeys = publicPGPKeys;
    }
}
exports.default = Consent;
//# sourceMappingURL=Consent.js.map