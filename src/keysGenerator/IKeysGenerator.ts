interface IKeysGenerator {

    /**
     * This method generates your keys using PGP.
     */
    generateKeys(data: any): any;

}

export default IKeysGenerator;