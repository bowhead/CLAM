interface IKeysGenerator<T> {

    /**
     * This method generates your keys using PGP.
     */
    generateKeys(data: any): Promise<T>

}

export default IKeysGenerator;