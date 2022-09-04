import {
    EncryptionLayerPGP,
    EncryptionLayerAES,
    IEncryptionLayer,
    IKeysGenerator,
    KeysGeneratorPGP
} from '../src/';

describe('Testing encryption using PGP', () => {
    const keysGenerator: IKeysGenerator = new KeysGeneratorPGP();
    const encryptionPGP: IEncryptionLayer = new EncryptionLayerPGP();

    test('should encrypt the message "Hello BowHead"', async () => {
        const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
        const { publicKey } = keys;
        const message = 'Hello BowHead';
        const messageEncrypted: string = await encryptionPGP.encryptData(publicKey, message);
        expect(messageEncrypted.length).toBeGreaterThan(0);
        expect(messageEncrypted.includes('-----BEGIN PGP MESSAGE-----')).toBe(true);
        expect(messageEncrypted.includes('-----END PGP MESSAGE-----')).toBe(true);
    });

    test('should not encrypt the message if the public PGP key is not valid', async () => {
        await expect(async () => {
            await encryptionPGP.encryptData('key', 'message');
        }).rejects.toThrow('Misformed armored text');
    });

    test('should throw an error if the data length equals 0 when encrypting.', async () => {
        await expect(async () => {
            await encryptionPGP.encryptData('key', '');
        }).rejects.toThrow('The data must have at least one character');
    });

    test('should decrypt the message encrypted "Hello BowHead" using the private PGP key ', async () => {
        const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
        const { publicKey, privateKey } = keys;
        const message = 'Hello BowHead';
        const messageEncrypted: string = await encryptionPGP.encryptData(publicKey, message);
        const messageDecrypted: string = await encryptionPGP.decryptData(privateKey, messageEncrypted);
        expect(messageDecrypted).toBe('Hello BowHead');
    });

    test('should not decrypt the message encrypted "Hello BowHead" if the private PGP key is not valid', async () => {
        await expect(async () => {
            const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = 'Hello BowHead';
            const messageEncrypted: string = await encryptionPGP.encryptData(publicKey, message);
            await encryptionPGP.decryptData('key', messageEncrypted);
        }).rejects.toThrow('Misformed armored text');

    });

    test('should throw and error if the data length equals 0 when decrypting.', async () => {
        await expect(async () => {
            const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = 'Hello BowHead';
            const messageEncrypted: string = await encryptionPGP.encryptData(publicKey, message);
            await encryptionPGP.decryptData('key', messageEncrypted);
        }).rejects.toThrow('Misformed armored text');
    });

    test('should encrypt message with multiple key', async () => {
        const mainKeys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
        const secondaryKeys = await keysGenerator.generateKeys({ name: 'Name2', email: 'email@email.com' });

        const publicKey = `${mainKeys.publicKey},${secondaryKeys.publicKey}`;

        const message = 'Hello BowHead';
        const messageEncrypted: string = await encryptionPGP.encryptData(publicKey, message);

        expect(messageEncrypted.length).toBeGreaterThan(0);

        let messageDecrypted: string = await encryptionPGP.decryptData(mainKeys.privateKey, messageEncrypted);
        expect(messageDecrypted).toBe('Hello BowHead');

        messageDecrypted = await encryptionPGP.decryptData(secondaryKeys.privateKey, messageEncrypted);
        expect(messageDecrypted).toBe('Hello BowHead');
    });
});




describe('Testing encryption using AES', () => {
    const keysGenerator: IKeysGenerator = new KeysGeneratorPGP();
    const encryptionAES: IEncryptionLayer = new EncryptionLayerAES();

    test('should encrypt the message "Hello BowHead" using AES-256 algorithm', async () => {
        const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
        const { publicKey } = keys;
        const message = 'Hello BowHead';
        const messageEncrypted: string = await encryptionAES.encryptData(publicKey, message);
        expect(messageEncrypted.length).toBeGreaterThan(0);
    });

    test('should throw an error if the data length is equal 0 when encrypting.', async () => {
        await expect(async () => {
            const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { publicKey } = keys;
            const message = '';
            await encryptionAES.encryptData(publicKey, message);
        }).rejects.toThrow('The data must have at least one character');
    });

    test('should throw an error if the key length is equal 0 or less than 5 when encrypting.', async () => {
        await expect(async () => {
            const message = 'Como Estás';
            await encryptionAES.encryptData('', message);
        }).rejects.toThrow('Error, the length of the key to encrypt the data must be greater than 5');
    });

    test('should decrypt the message encrypted "hHello BowHead" using the private PGP key with AES-256 algorithm ', async () => {
        const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
        const { privateKey } = keys;
        const message = 'Hello BowHead';
        const messageEncrypted: string = await encryptionAES.encryptData(privateKey, message);
        const messageDecrypted: string = await encryptionAES.decryptData(privateKey, messageEncrypted);
        expect(messageDecrypted).toBe('Hello BowHead');
    });

    test('should throw an error if the data length is equal 0 when decrypting.', async () => {
        await expect(async () => {
            const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { privateKey } = keys;
            const message = '';
            const messageEncrypted: string = await encryptionAES.encryptData(privateKey, message);
            const messageDecrypted: string = await encryptionAES.decryptData(privateKey, messageEncrypted);
            expect(messageDecrypted).toBe('Hello BowHead');
        }).rejects.toThrow('The data must have at least one character');
    });

    test('should throw an error if the key length is equal 0 or less than 5 when decrypting.', async () => {
        await expect(async () => {
            const keys = await keysGenerator.generateKeys({ name: 'Name', email: 'email@email.com' });
            const { privateKey } = keys;
            const message = 'Hello BowHead';
            const messageEncrypted: string = await encryptionAES.encryptData(privateKey, message);
            const messageDecrypted: string = await encryptionAES.decryptData('1', messageEncrypted);
            expect(messageDecrypted).toBe('Hello BowHead');
        }).rejects.toThrow('Error, the length of the key to decrypt the data must be greater than 5');
    });

});