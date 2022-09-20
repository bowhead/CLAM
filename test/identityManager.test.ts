import { IdentityManager, FactoryIdentity } from '../src';

describe('Testing IdentityManager class', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();

    test('should the instance of the IdentityManager class have the correct structure', () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');

        const objectKeys: string[] = Object.keys(instance);
        expect(objectKeys.includes('mnemonic')).toBe(true);
        expect(objectKeys.includes('address')).toBe(true);
        expect(objectKeys.includes('privateKey')).toBe(true);
        expect(objectKeys.includes('publicKey')).toBe(true);
        expect(objectKeys.includes('publicKeySpecial')).toBe(true);
        expect(objectKeys.includes('privateKeySpecial')).toBe(true);
        expect(objectKeys.includes('encryptionLayer')).toBe(true);
        expect(objectKeys.includes('keysGenerator')).toBe(true);
        expect(objectKeys.includes('generateIdentity')).toBe(true);
        expect(objectKeys.length).toBe(9);
    });


    test('should the mnemonic property length be equal to 0', () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        expect(instance.mnemonic.length).toBe(0);
    });

    test('should the mnemonic property have a string with 12 words', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        await instance.generateIdentity();
        expect(instance.mnemonic.length).toBeGreaterThan(0);
        expect(instance.mnemonic.split(' ').length).toBe(12);
    });

    test('should the address property length be equal to 0', () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        expect(instance.address.length).toBe(0);
    });

    test('should the address property length be different to 0 and equal to 42', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        await instance.generateIdentity();
        expect(instance.address.length).toBeGreaterThan(0);
        expect(instance.address.length).toBe(42);
    });

    test('should the privateKey property length be equal to 0', () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        expect(instance.privateKey.length).toBe(0);
    });

    test('should the privateKey property length be different to 0 and equal to 64', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        await instance.generateIdentity();
        expect(instance.privateKey.length).toBe(64);
    });

    test('should the publicKey property length be equal to 0', () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        expect(instance.publicKey.length).toBe(0);
    });

    test('should the publicKey property length be different to 0 and equal to 66', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        await instance.generateIdentity();
        expect(instance.publicKey.length).toBe(66);
    });

    test('The publicKeyPGP and privateKeyPGP properties must have a size greater than 0.', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        await instance.generateIdentity();
        expect(instance.publicKeySpecial.toString().trim().length).toBeGreaterThan(0);
        expect(instance.privateKeySpecial.toString().trim().length).toBeGreaterThan(0);
    });

    test('should reestablish address, public and private keys based in mnemonic', async () => {
        const mnemonic = 'delay balance merry once cheese proof game casual empty tired flavor stove';
        const identity: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        await identity.generateIdentity(mnemonic);
        const identityExpected = {
            mnemonic,
            address: '0xe55ee741311d6cf9a7528612cb88d17f18558e6f',
            privateKey: 'b8bdc07b70ea6a362cd42155b66af8389a674f67f8e1127a240bcbf61502ace0',
            publicKey: '0223f205f394df3fdf1fb1607eb634eb5603740f0059250b7f6b494ac6ee5028cb'
        };

        expect(identity.mnemonic).toBe(identityExpected.mnemonic);
        expect(identity.address).toBe(identityExpected.address);
        expect(identity.privateKey).toBe(identityExpected.privateKey);
        expect(identity.publicKey).toBe(identityExpected.publicKey);
    });

});
