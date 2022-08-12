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
        try {
            await encryptionPGP.ecryptData('key', 'message');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Misformed armored text');
        }
    });

    test('should throw an error if the data length equals 0 when encrypting.', async () => {
        try {
            await encryptionPGP.ecryptData('key', '');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The data must have at least one character');
        }
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
        try {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = 'hello bowhaed';
            const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);
            await encryptionPGP.decryptData('key', messageEncrypted);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Misformed armored text');
        }
    });
    test('should throw and error if the data length equals 0 when decrypting.', async () => {
        try {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = 'hello bowhaed';
            const messageEncrypted: string = await encryptionPGP.ecryptData(publicKey, message);
            await encryptionPGP.decryptData('key', messageEncrypted);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Misformed armored text');
        }
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
        try {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = '';
            await encryptionAES.ecryptData(publicKey, message);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The data must have at least one character');
        }

    });
    test('should throw an error if the key length is equal 0 or less than 5 when ecnrypting.', async () => {
        try {
            const message = 'Como estas';
            await encryptionAES.ecryptData('', message);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Error, the length of the key to encrypt the data must be greater than 5');
        }

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
        try {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { privateKey } = keys;
            const message = '';
            const messageEncrypted: string = await encryptionAES.ecryptData(privateKey, message);
            const messageDecrypted: string = await encryptionAES.decryptData(privateKey, messageEncrypted);
            expect(messageDecrypted).toBe('hello bowhaed');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('The data must have at least one character');
        }

    });
    test('should throw an error if the key length is equal 0 or less than 5 when decrypting.', async () => {
        try {
            const keys = await keysGeneratos.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { privateKey } = keys;
            const message = 'Hello bowhead';
            const messageEncrypted: string = await encryptionAES.ecryptData(privateKey, message);
            const messageDecrypted: string = await encryptionAES.decryptData('1', messageEncrypted);
            expect(messageDecrypted).toBe('hello bowhaed');
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('Error, the length of the key to decrypt the data must be greater than 5');
        }

    });

});