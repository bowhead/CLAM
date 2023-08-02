/**
 * This class represent the access structure.
 */
declare class Access {
    user: string;
    accountsShared: string[];
    resourceShared: string;
    sharedDate: Date;
    shared: boolean;
    index: number;
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
    constructor(user: string, accountsShared: string[], resourceShared: string, sharedDate: Date, shared: boolean, index: number);
}
export default Access;
