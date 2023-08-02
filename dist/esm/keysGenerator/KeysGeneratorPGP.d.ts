import IKeysGenerator from './IKeysGenerator';
import IKeys from './IKeys';
/**
 * This class
 */
declare class KeysGeneratorPGP implements IKeysGenerator {
    /**
     * This function generate keys using an specific implementation.
     *
     * @param {any} data This parameter is the information to generate the keys.
     * @returns {Primise<IKeys>} return the keys.
     */
    generateKeys: (data: object) => Promise<IKeys>;
}
export default KeysGeneratorPGP;
