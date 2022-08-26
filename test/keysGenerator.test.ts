/*global global, expect, test, describe*/

import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

import { IKeysGenerator, KeysGeneratorPGP } from '../src';

describe('Testing keys generator', () => {
    const generatorPGP: IKeysGenerator = new KeysGeneratorPGP();
    test('the instance of KeyGeneratorPGP should have a good structure', () => {
        const keys = Object.keys(generatorPGP);
        expect(keys.includes('generateKeys')).toBe(true);
        expect(keys.length).toBe(1);
    });
    test('should generate private and public PGP keys ', async () => {
        const data = {
            name: 'name',
            email: 'email@email.com'
        };
        const { privateKey, publicKey } = await generatorPGP.generateKeys(data);
        expect(privateKey.includes('-----BEGIN PGP PRIVATE KEY BLOCK-----')).toBe(true);
        expect(privateKey.includes('-----END PGP PRIVATE KEY BLOCK-----')).toBe(true);
        expect(publicKey.includes('-----BEGIN PGP PUBLIC KEY BLOCK-----')).toBe(true);
        expect(publicKey.includes('-----END PGP PUBLIC KEY BLOCK-----')).toBe(true);
    });

    test('should not generate private and public PGP keys ', async () => {
        await expect(async () => {
            const data = {
                name: 'name',
                email: 'email'
            };
            await generatorPGP.generateKeys(data);
        }).rejects.toThrow('Error generating keypair: Invalid user ID format')
    });
});