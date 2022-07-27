import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
import EncryptionLayerPGP from "../src/encryptionLayer/EncryptioLayerPGP";
import EncryptioLayerAES from "../src/encryptionLayer/EncryptioLayerAES";

import IEncryptionLayer from "../src/encryptionLayer/IEncryptionLayer";
import IKeysGenerator from "../src/keysGenerator/IKeysGenerator"
import KeysGeneratorPGP from "../src/keysGenerator/KeysGeneratorPGP";

describe('Testing encryption using PGP', () => {
    const keysGeneratos: IKeysGenerator = new KeysGeneratorPGP();
    const encryptionPGP: IEncryptionLayer = new EncryptionLayerPGP();

    test('should generate public and private PGP keys', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { privateKey, publicKey } = keys;
        expect(privateKey.length).toBeGreaterThan(0);
        expect(publicKey.length).toBeGreaterThan(0);
    });

    test('should no generate public andprivate PGP keys if the name and email parameters are not valid', async () => {
        try {
            await keysGeneratos.generateKeys({ name: "Name", email: "email" });
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Error generating keypair: Invalid user ID format");
        }

    });
    test('should ecnrypt the message "hello bowhead"', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { publicKey } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);

        expect(messageEncrypted.length).toBeGreaterThan(0);
        expect(messageEncrypted.includes("-----BEGIN PGP MESSAGE-----")).toBe(true);
        expect(messageEncrypted.includes("-----END PGP MESSAGE-----")).toBe(true);
    });

    test('should not encrypt the message if the public PGP key is not valid', async () => {
        try {
            await encryptionPGP.ecryptData("key", "message");
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Misformed armored text");
        }


    });

    test('should decrypt the message encrypted "hello bowhead" using the private PGP key ', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { publicKey, privateKey } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);
        const messageDecrypted: string = await encryptionPGP.decryptData(privateKey, messageEncrypted);
        expect(messageDecrypted).toBe("hello bowhaed");
    });
    test('should not decrypt the message encrypted "hello bowhead" if the private PGP key is not valid', async () => {


        try {
            const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
            const { publicKey } = keys;
            const message: string = "hello bowhaed";
            const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);
            await encryptionPGP.decryptData("key", messageEncrypted);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Misformed armored text");
        }
    });

});




describe('Testing encryption using AES', () => {
    const keysGeneratos: IKeysGenerator = new KeysGeneratorPGP();
    const encryptionAES: IEncryptionLayer = new EncryptioLayerAES();


    test('should ecnrypt the message "hello bowhead" using AES-256 algorithm', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { publicKey } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionAES.ecryptData(publicKey, message);
        expect(messageEncrypted.length).toBeGreaterThan(0);
    });

    test('should decrypt the message encrypted "hello bowhead" using the private PGP key with AES-256 algorithm ', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { privateKey } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionAES.ecryptData(privateKey, message);
        const messageDecrypted: string = await encryptionAES.decryptData(privateKey, messageEncrypted);
        expect(messageDecrypted).toBe("hello bowhaed");
    });

});