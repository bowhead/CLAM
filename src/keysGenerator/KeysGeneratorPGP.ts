import { injectable } from 'tsyringe';
import IKeysGenerator from './IKeysGenerator';
import IKeys from './IKeys';
import { generateKey } from 'openpgp';
import { IKeysInfo } from './types/IKeysInfo';

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
    public generateKeys = async (data: object): Promise<IKeys> => {
        const PGPKeys: IKeys = {
            privateKey: '',
            publicKey: ''
        };
        const { name, email } = data as IKeysInfo;
        const { privateKey, publicKey } = await generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [{ name, email }],
            passphrase: 'passphrase',
            format: 'armored'
        });
        PGPKeys.privateKey = privateKey;
        PGPKeys.publicKey = publicKey;
        return PGPKeys;
    };

}

export default KeysGeneratorPGP;