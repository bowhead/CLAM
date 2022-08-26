/*global global, expect, test, describe*/
import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
import {
    EncryptionLayerPGP,
    EncryptioLayerAES,
    IEncryptionLayer,
    IKeysGenerator,
    KeysGeneratorPGP
} from '../src/';

describe('Testing encryption using PGP', () => {
    const keysGeneratos: IKeysGenerator = new KeysGeneratorPGP();
    const encryptionPGP: IEncryptionLayer = new EncryptionLayerPGP();

    test('should ecnrypt the message "hello bowhead"', async () => {
        const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
        const { publicKey } = keys;
        const message = 'hello bowhaed';
        const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);
        expect(messageEncrypted.length).toBeGreaterThan(0);
        expect(messageEncrypted.includes('-----BEGIN PGP MESSAGE-----')).toBe(true);
        expect(messageEncrypted.includes('-----END PGP MESSAGE-----')).toBe(true);
    });

    test('should not encrypt the message if the public PGP key is not valid', async () => {
        await expect(async () => {
            await encryptionPGP.ecryptData('key', 'message');
        }).rejects.toThrow('Misformed armored text');
    });

    test('should throw an error if the data length equals 0 when encrypting.', async () => {
        await expect(async () => {
            await encryptionPGP.ecryptData('key', '');
        }).rejects.toThrow('The data must have at least one character');
    });

    test('should decrypt the message encrypted "hello bowhead" using the private PGP key ', async () => {
        const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
        const { publicKey, privateKey } = keys;
        const message = 'hello bowhaed';
        const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);
        const messageDecrypted: string = await encryptionPGP.decryptData(privateKey, messageEncrypted);
        expect(messageDecrypted).toBe('hello bowhaed');
    });

    test('should not decrypt the message encrypted "hello bowhead" if the private PGP key is not valid', async () => {
        await expect(async () => {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = 'hello bowhaed';
            const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);
            await encryptionPGP.decryptData('key', messageEncrypted);
        }).rejects.toThrow('Misformed armored text');

    });

    test('should throw and error if the data length equals 0 when decrypting.', async () => {
        await expect(async () => {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = 'hello bowhaed';
            const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);
            await encryptionPGP.decryptData('key', messageEncrypted);
        }).rejects.toThrow('Misformed armored text');
    });

    test('should encrypt message with multiple key', async () => {
        const mainKeys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
        const secondaryKeys = await keysGeneratos.generateKeys({ name: 'Name2', email: 'email@email.com' });

        const publicKey = `${mainKeys.publicKey},${secondaryKeys.publicKey}`;

        const message = 'hello bowhaed';
        const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);

        expect(messageEncrypted.length).toBeGreaterThan(0);

        let messageDecrypted: string = await encryptionPGP.decryptData(mainKeys.privateKey, messageEncrypted);
        expect(messageDecrypted).toBe('hello bowhaed');

        messageDecrypted = await encryptionPGP.decryptData(secondaryKeys.privateKey, messageEncrypted);
        expect(messageDecrypted).toBe('hello bowhaed');
    });
});




describe('Testing encryption using AES', () => {
    const keysGeneratos: IKeysGenerator = new KeysGeneratorPGP();
    const encryptionAES: IEncryptionLayer = new EncryptioLayerAES();

    test('should ecnrypt the message "hello bowhead" using AES-256 algorithm', async () => {
        const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
        const { publicKey } = keys;
        const message = 'hello bowhaed';
        const messageEncrypted: string = await encryptionAES.ecryptData(publicKey, message);
        expect(messageEncrypted.length).toBeGreaterThan(0);
    });

    test('should throw an error if the data length is equal 0 when ecnrypting.', async () => {
        await expect(async () => {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = '';
            await encryptionAES.ecryptData(publicKey, message);
        }).rejects.toThrow('The data must have at least one character');
    });

    test('should throw an error if the key length is equal 0 or less than 5 when ecnrypting.', async () => {
        await expect(async () => {
            const message = 'Como estas';
            await encryptionAES.ecryptData('', message);
        }).rejects.toThrow('Error, the length of the key to encrypt the data must be greater than 5');
    });

    test('should decrypt the message encrypted "hello bowhead" using the private PGP key with AES-256 algorithm ', async () => {
        const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
        const { privateKey } = keys;
        const message = 'hello bowhaed';
        const messageEncrypted: string = await encryptionAES.ecryptData(privateKey, message);
        const messageDecrypted: string = await encryptionAES.decryptData(privateKey, messageEncrypted);
        expect(messageDecrypted).toBe('hello bowhaed');
    });

    test('should throw an error if the data length is equal 0 when decrypting.', async () => {
        await expect(async () => {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { privateKey } = keys;
            const message = '';
            const messageEncrypted: string = await encryptionAES.ecryptData(privateKey, message);
            const messageDecrypted: string = await encryptionAES.decryptData(privateKey, messageEncrypted);
            expect(messageDecrypted).toBe('hello bowhaed');
        }).rejects.toThrow('The data must have at least one character');
    });

    test('should throw an error if the key length is equal 0 or less than 5 when decrypting.', async () => {
        await expect(async () => {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { privateKey } = keys;
            const message = 'Hello bowhead';
            const messageEncrypted: string = await encryptionAES.ecryptData(privateKey, message);
            const messageDecrypted: string = await encryptionAES.decryptData('1', messageEncrypted);
            expect(messageDecrypted).toBe('hello bowhaed');
        }).rejects.toThrow('Error, the length of the key to decrypt the data must be greater than 5');
    });

});