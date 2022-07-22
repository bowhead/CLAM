
import IKeysGenerator from "../interfaces/IKeysGenerator";
import { generateKey } from "openpgp";

class KeysGeneratorPGP implements IKeysGenerator {

    generateKeys = async (data: any = null): Promise<any> => {
        const pgpKeys = {
            privateKeyPGP: "",
            publicKeyPGP: ""
        };
        const { name, email } = data;
        try {
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
        } catch (error) {
            return pgpKeys;
        }
    }

}


export default KeysGeneratorPGP;