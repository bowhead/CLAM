
import IKeysGenerator from "./IKeysGenerator";
import IKeys from "./IKeys";
import { generateKey } from "openpgp";

class KeysGeneratorPGP implements IKeysGenerator {

    public generateKeys = async (data: any): Promise<IKeys> => {
        const pgpKeys: IKeys = {
            privateKey: "",
            publicKey: ""
        };
        const { name, email } = data;
        const { privateKey, publicKey } = await generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [{ name, email }],
            passphrase: "passphrase",
            format: 'armored'
        });
        pgpKeys.privateKey = privateKey;
        pgpKeys.publicKey = publicKey;
        return pgpKeys;
    }

}

export default KeysGeneratorPGP;