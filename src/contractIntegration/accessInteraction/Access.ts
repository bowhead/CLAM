/**
 * This clase represent the access estructure.
 */

class Access {
    public user: string;
    public accountsShared: string[];
    public resourceShared: string;
    public sharedDate: Date;
    public shared: boolean;
    public index: number;

    /**
     * Constructor that initializes the class intent with the values passed as parameters.
     * 
     * @param {string} user This parameter is the user address. 
     * @param {string[]} accountsShared This parameter are the users shared.
     * @param {string} resourceShared This parameter is the resource shared.
     * @param {Date} sharedDate This parameter is the exact date the resource was shared.
     * @param {boolean} shared This parameter is the status of the access.
     * @param {number} index This parameter is the index of the acess.
     */
    public constructor(
        user: string,
        accountsShared: string[],
        resourceShared: string,
        sharedDate: Date,
        shared: boolean,
        index: number
    ) {
        this.user = user;
        this.accountsShared = accountsShared;
        this.resourceShared = resourceShared;
        this.sharedDate = sharedDate;
        this.shared = shared;
        this.index = index;
    }
}

export default Access;