import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
import EncryptionLayer from "../src/encryptionLayer/EncryptioLayer";
import IEncryptionLayer from "../src/interfaces/IEncryptionLayer";

describe('Name of the group', () => {
    const encryption: IEncryptionLayer = new EncryptionLayer();
    test('should generate public and private PGP keys', async () => {
        const keys = await encryption.generatePGPKeys("Name", "email@email.com");
        const { privateKeyPGP, publicKeyPGP } = keys;
        expect(privateKeyPGP.length).toBeGreaterThan(0);
        expect(publicKeyPGP.length).toBeGreaterThan(0);
    });

    test('should no generate public andprivate PGP keys if the name and email parameters are not valid', async () => {
        const keys = await encryption.generatePGPKeys("Name", "Email");
        const { privateKeyPGP, publicKeyPGP } = keys;
        expect(privateKeyPGP.length).toBe(0);
        expect(publicKeyPGP.length).toBe(0);
        expect(privateKeyPGP).toBe("");
        expect(publicKeyPGP).toBe("");

    });
    test('should ecnrypt the message "hello bowhead"', async () => {
        const keys = await encryption.generatePGPKeys("Name", "email@email.com");
        const { publicKeyPGP } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryption.ecryptData(publicKeyPGP, message);

        expect(messageEncrypted.length).toBeGreaterThan(0);
        expect(messageEncrypted.includes("-----BEGIN PGP MESSAGE-----")).toBe(true);
        expect(messageEncrypted.includes("-----END PGP MESSAGE-----")).toBe(true);

    });

    test('should not encrypt the message if the public PGP key is not valid', async () => {
        const messageEncrypted = await encryption.ecryptData("key", "message");
        expect(messageEncrypted).toBe("Error while encrypting data");

    });

    test('should decrypt the message encrypted "hello bowhead" using the private PGP key ', async () => {
        const keys = await encryption.generatePGPKeys("Name", "email@email.com");
        const { publicKeyPGP, privateKeyPGP } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryption.ecryptData(publicKeyPGP, message);
        const messageDecrypted: string = await encryption.decryptData(privateKeyPGP, messageEncrypted);
        expect(messageDecrypted).toBe("hello bowhaed");

    });
    test('should not decrypt the message encrypted "hello bowhead" if the private PGP key is not valid', async() => {
        const keys = await encryption.generatePGPKeys("Name", "email@email.com");
        const { publicKeyPGP } = keys;
        const message: string = "hello bowhaed";
        const messageEncrypted: string = await encryption.ecryptData(publicKeyPGP, message);
        const messageDecrypted: string = await encryption.decryptData("key", messageEncrypted);
        expect(messageDecrypted).toBe("Error while decrypting data");
    });

});