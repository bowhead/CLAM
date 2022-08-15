import IKeys from './IKeys';

interface IKeysGenerator {

    /**
     * This method generates your keys using PGP.
     */
    generateKeys(data: any): Promise<IKeys>;

}

export default IKeysGenerator;