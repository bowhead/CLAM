"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class represent the access structure.
 */
class Access {
    /**
     * Constructor that initializes the class intent with the values passed as parameters.
     *
     * @param {string} user This parameter is the user address.
     * @param {string[]} accountsShared This parameter are the users shared.
     * @param {string} resourceShared This parameter is the resource shared.
     * @param {Date} sharedDate This parameter is the exact date the resource was shared.
     * @param {boolean} shared This parameter is the status of the access.
     * @param {number} index This parameter is the index of the access.
     */
    constructor(user, accountsShared, resourceShared, sharedDate, shared, index) {
        this.user = user;
        this.accountsShared = accountsShared;
        this.resourceShared = resourceShared;
        this.sharedDate = sharedDate;
        this.shared = shared;
        this.index = index;
    }
}
exports.default = Access;
//# sourceMappingURL=Access.js.map