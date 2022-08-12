import { injectable } from 'tsyringe';
import IKeysGenerator from './IKeysGenerator';
import IKeys from './IKeys';
import { generateKey } from 'openpgp';

/**
 * This class
 */
@injectable()
class KeysGeneratorPGP implements IKeysGenerator {

    /**
     * This function generate keys using an specific implementation.
     * 
     * @param {any} data This parameter is the information to generate the keys.
     * @returns {Primise<IKeys>} return the keys.
     */
    public generateKeys = async (data: any): Promise<IKeys> => {
        const pgpKeys: IKeys = {
            privateKey: '',
            publicKey: ''
        };
        const { name, email } = data;
        const { privateKey, publicKey } = await generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [{ name, email }],
            passphrase: 'passphrase',
            format: 'armored'
        });
        pgpKeys.privateKey = privateKey;
        pgpKeys.publicKey = publicKey;
        return pgpKeys;
    }

}

export default KeysGeneratorPGP;