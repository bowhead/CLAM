import {
    FactoryIdentity,
    IdentityManager,
    IEncryptionLayer,
    IKeys,
    IKeysGenerator
} from '../src';
import { IKeysInfo } from '../src/keysGenerator/types/IKeysInfo';

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
    async encryptData(key: string, data: string): Promise<string> {
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
        const dataDecrypted: string = data.split('-')[1] + (key? '': key);
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
    async generateKeys(data: object): Promise<IKeys> {
        const PGPKeys: IKeys = {
            privateKey: '',
            publicKey: ''
        };
        const { name, email } = data as IKeysInfo;

        PGPKeys.privateKey = `1fasd324fasdfheher2342f ${name}`;
        PGPKeys.publicKey = `fasdfasdfasf432432hytjy ${email}`;
        return PGPKeys;
    }

}





describe('Testing FactoryIdentityClass', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();

    test('should create a instance of IdentityManager with PGP encrypt and keys generator', () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        expect(identity).not.toBe(null);
    });
    test('should create a instance of IdentityManager with AES encrypt and PGP keys generator', () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('AES', 'PGP');
        expect(identity).not.toBe(null);
    });
    test('should create an identity based on the created Lulu identity.', () => {
        factoryIdentity.setOptionEncryption({ name: 'lulu', option: EncryptionLayerLULU });
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'PGP');
        expect(identity).not.toBe(null);
    });
    test('should create an identity based on the created Lulu identity and encrypt the info using lulu', async () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'PGP');
        await identity.generateIdentity();

        const messageEncrypted = await identity.encryptionLayer.encryptData('privateKey', 'Como estás');
        expect(messageEncrypted).toBe('privateKey-Como estás');
    });
    test('should create an identity based on the created Lulu identity and decrypt the info using lulu', async () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'PGP');
        await identity.generateIdentity();
        const messageEncrypted = await identity.encryptionLayer.encryptData('privateKey', 'Como estás');
        const messageDecrypted = await identity.encryptionLayer.decryptData('privateKey', messageEncrypted);
        expect(messageDecrypted).toBe('Como estás');
    });
    test('should create an identity based in RSA', () => {
        factoryIdentity.setOptionKeysGenerator({ name: 'RSA', option: KeysGeneratorRSA });
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'RSA');
        expect(identity).not.toBe(null);
    });

    test('should generate private and public keys using RSA', async () => {
        const identity: IdentityManager = factoryIdentity.generateIdentity('lulu', 'RSA');
        await identity.generateIdentity();
        expect(identity.privateKeySpecial).toBe(`1fasd324fasdfheher2342f ${identity.address}`);
        expect(identity.publicKeySpecial).toBe(`fasdfasdfasf432432hytjy ${identity.address}@localhost.com`);

    });


});

