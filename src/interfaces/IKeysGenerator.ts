interface IKeysGenerator {

    /**
     * This method generates your keys using PGP.
     */
    generateKeys(data: any): Promise<any>

}

export default IKeysGenerator;