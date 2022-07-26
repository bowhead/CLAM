
import IKeysGenerator from "./IKeysGenerator";
import { generateKey } from "openpgp";
import IKeysPGP from "./IKeysPGP";

class KeysGeneratorPGP implements IKeysGenerator<IKeysPGP> {

    public generateKeys = async (data: any = null): Promise<IKeysPGP> => {
        const pgpKeys: IKeysPGP = {
            privateKeyPGP: "",
            publicKeyPGP: ""
        };
        const { name, email } = data;
        const { privateKey, publicKey } = await generateKey({
            type: 'ecc',
            curve: 'curve25519',
            userIDs: [{ name, email }],
            passphrase: "passphrase",
            format: 'armored'
        });
        pgpKeys.privateKeyPGP = privateKey;
        pgpKeys.publicKeyPGP = publicKey;
        return pgpKeys;
    }

}


export default KeysGeneratorPGP;