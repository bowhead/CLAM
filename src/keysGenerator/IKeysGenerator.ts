import IKeys from './IKeys';

interface IKeysGenerator {

    /**
     * This method generates your keys using PGP.
     */
    generateKeys(data: object): Promise<IKeys>;

}

export default IKeysGenerator;