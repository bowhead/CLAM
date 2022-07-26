import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import IKeysGenerator from "../src/keysGenerator/IKeysGenerator";
import KeysGeneratorPGP from "../src/keysGenerator/KeysGeneratorPGP";
import IKeysPGP from "../src/keysGenerator/IKeysPGP";


describe('Testing keys generator', () => {
    const generatorPGP: IKeysGenerator<IKeysPGP> = new KeysGeneratorPGP();
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
        try {
            const data = {
                name: "name",
                email: "email"
            }
            await generatorPGP.generateKeys(data);

        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Error generating keypair: Invalid user ID format")
        }

    });
});