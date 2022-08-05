class Access {
    public user: string;
    public accountsShared: string[];
    public resourceShared: string;
    public sharedDate: Date;
    public shared: boolean;
    public index: number;
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