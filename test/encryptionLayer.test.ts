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
        const { privateKeyPGP, publicKeyPGP } = keys;
        expect(privateKeyPGP.length).toBeGreaterThan(0);
        expect(publicKeyPGP.length).toBeGreaterThan(0);
    });

    test('should no generate public andprivate PGP keys if the name and email parameters are not valid', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email" });
        const { privateKeyPGP, publicKeyPGP } = keys;
        expect(privateKeyPGP.length).toBe(0);
        expect(publicKeyPGP.length).toBe(0);
        expect(privateKeyPGP).toBe("");
        expect(publicKeyPGP).toBe("");
    });
    test('should ecnrypt the message "hello bowhead"', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { publicKeyPGP } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionPGP.ecryptData(publicKeyPGP, message);

        expect(messageEncrypted.length).toBeGreaterThan(0);
        expect(messageEncrypted.includes("-----BEGIN PGP MESSAGE-----")).toBe(true);
        expect(messageEncrypted.includes("-----END PGP MESSAGE-----")).toBe(true);
    });

    test('should not encrypt the message if the public PGP key is not valid', async () => {
        const messageEncrypted = await encryptionPGP.ecryptData("key", "message");
        expect(messageEncrypted).toBe("Error while encrypting data");
    });

    test('should decrypt the message encrypted "hello bowhead" using the private PGP key ', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { publicKeyPGP, privateKeyPGP } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionPGP.ecryptData(publicKeyPGP, message);
        const messageDecrypted: string = await encryptionPGP.decryptData(privateKeyPGP, messageEncrypted);
        expect(messageDecrypted).toBe("hello bowhaed");
    });
    test('should not decrypt the message encrypted "hello bowhead" if the private PGP key is not valid', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { publicKeyPGP } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionPGP.ecryptData(publicKeyPGP, message);
        const messageDecrypted: string = await encryptionPGP.decryptData("key", messageEncrypted);
        expect(messageDecrypted).toBe("Error while decrypting data");
    });

});




describe('Testing encryption using AES', () => {
    const keysGeneratos: IKeysGenerator = new KeysGeneratorPGP();
    const encryptionAES: IEncryptionLayer = new EncryptioLayerAES();


    test('should ecnrypt the message "hello bowhead" using AES-256 algorithm', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { privateKeyPGP } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionAES.ecryptData(privateKeyPGP, message);
        expect(messageEncrypted.length).toBeGreaterThan(0);
    });

    test('should decrypt the message encrypted "hello bowhead" using the private PGP key with AES-256 algorithm ', async () => {
        const keys = await keysGeneratos.generateKeys({ name: "Name", email: "email@email.com" });
        const { privateKeyPGP } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryptionAES.ecryptData(privateKeyPGP, message);
        const messageDecrypted: string = await encryptionAES.decryptData(privateKeyPGP, messageEncrypted);
        expect(messageDecrypted).toBe("hello bowhaed");
    });

});