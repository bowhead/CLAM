/*global global, expect, test, describe*/

import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
import {
    FactoryIdentity,
    IdentityManager,
    IEncryptionLayer,
    IKeys,
    IKeysGenerator
} from '../src';

/**
 * Class example
 */
class EncryptionLayerLULU implements IEncryptionLayer {
    /**
     * Code
     * 
     * @param {string} key parameter
     * @param {string} data parameter
     * @returns {Promise<string>} return string
     */
    async ecryptData(key: string, data: string): Promise<string> {
        const dataEncrypted: string = key + '-' + data;
        return dataEncrypted;
    }

    /**
     * Code
     * 
     * @param {string} key parameter
     * @param {string} data parameter
     * @returns {Promise<string>} return string 
     */
    async decryptData(key: string, data: string): Promise<string> {
        console.log(key);
        const dataDecrypted: string = data.split('-')[1];
        return dataDecrypted;
    }

}

/**
 * Class example
 */
class KeysGeneratorRSA implements IKeysGenerator {
    /**
     * Code
     * 
     * @param {any} data parameter
     * @returns {Promise<IKeys>} return Ikeys
     */
    async generateKeys(data: any): Promise<IKeys> {
        const pgpKeys: IKeys = {
            privateKey: '',
            publicKey: ''
        };
        const { name, email } = data;

        pgpKeys.privateKey = `1fasd324fasdfheher2342f ${name}`;
        pgpKeys.publicKey = `fasdfasdfasf432432hytjy ${email}`;
        return pgpKeys;
    }

}





describe('Testing FactoryIdentityClass', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();

    test('should create a instance of IdentityManager with PGP encrypt and keys generator', () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
        expect(identity).not.toBe(null);
    });
    test('should create a instance of IdentityManager with AES encrypt and PGP keys generator', () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('aes', 'pgp');
        expect(identity).not.toBe(null);
    });
    test('should create an identity based on the created Lulu identity.', () => {
        factoryIdentity.setOptionEncryption({ name: 'lulu', option: EncryptionLayerLULU });
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'pgp');
        expect(identity).not.toBe(null);
    });
    test('should create an identity based on the created Lulu identity and encrypt the info using lulu', async () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'pgp');
        await identity.generateIdentity();

        const messageEncrypted = await identity.encryptionLayer.ecryptData('privateKey', 'Como estas');
        expect(messageEncrypted).toBe('privateKey-Como estas');
    });
    test('should create an identity based on the created Lulu identity and decrypt the info using lulu', async () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'pgp');
        await identity.generateIdentity();
        const messageEncrypted = await identity.encryptionLayer.ecryptData('privateKey', 'Como estas');
        const messageDecryped = await identity.encryptionLayer.decryptData('privateKey', messageEncrypted);
        expect(messageDecryped).toBe('Como estas');
    });
    test('should create an identity based in RSA', () => {
        factoryIdentity.setOptionKeysGenerator({ name: 'rsa', option: KeysGeneratorRSA });
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'rsa');
        expect(identity).not.toBe(null);
    });

    test('should generate private and public keys using RSA', async () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'rsa');
        await identity.generateIdentity();
        expect(identity.privateKeySpecial).toBe(`1fasd324fasdfheher2342f ${identity.address}`);
        expect(identity.publicKeySpecial).toBe(`fasdfasdfasf432432hytjy ${identity.address}@localhost.com`);

    });


});

