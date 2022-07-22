import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import IKeysGenerator from "../src/interfaces/IKeysGenerator";
import KeysGeneratorPGP from "../src/encryptionLayer/KeysGeneratorPGP";



describe('Testing keys generator', () => {
    const generatorPGP: IKeysGenerator = new KeysGeneratorPGP();
    test('the instance of KeyGeneratorPGP should have a good structure', () => {
        const keys = Object.keys(generatorPGP);
        expect(keys.includes("generateKeys")).toBe(true);
        expect(keys.length).toBe(1);
    });
    test('should generate private and public PGP keys ', async () => {
        const data = {
            name: "name",
            email: "email@email.com"
        }
        const { privateKeyPGP, publicKeyPGP } = await generatorPGP.generateKeys(data);
        expect(privateKeyPGP.includes("-----BEGIN PGP PRIVATE KEY BLOCK-----")).toBe(true);
        expect(privateKeyPGP.includes("-----END PGP PRIVATE KEY BLOCK-----")).toBe(true);

        expect(publicKeyPGP.includes("-----BEGIN PGP PUBLIC KEY BLOCK-----")).toBe(true);
        expect(publicKeyPGP.includes("-----END PGP PUBLIC KEY BLOCK-----")).toBe(true);


    });
    test('should not generate private and public PGP keys ', async () => {
        const data = {
            name: "name",
            email: "email"
        }
        const { privateKeyPGP, publicKeyPGP } = await generatorPGP.generateKeys(data);
        expect(privateKeyPGP).toBe("");
        expect(publicKeyPGP).toBe("");

    });
});