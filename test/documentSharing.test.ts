// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { 
    DocumentSharing,
    IdentityManager,
    FactoryIdentity,
    StorageEngine,
    IKeysGenerator,
    KeysGeneratorPGP, 
    IKeys
} from '../src';
import * as fs from 'fs';
import path from 'path';

import ABIConsent from './utilities/Consent.json';
import ABIAccess from './utilities/Access.json';
import ABIConsentResource from './utilities/ConsentResource.json';
import ABIIPFSManagement from './utilities/IPFSManagement.json';
import Web3Provider from '../src/contractIntegration/interaction/Web3Provider';
import { AccessInteraction, ConsentInteraction, FactoryInteraction ,Interaction } from '../src/contractIntegration';
import nock from 'nock';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

describe('Testing document sharing', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();
    const keysGenerator: IKeysGenerator = new KeysGeneratorPGP();

    const AESInstance: IdentityManager = factoryIdentity.generateIdentity('AES', 'PGP');
    AESInstance.generateIdentity();

    const PGPInstance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
    PGPInstance.generateIdentity();

    const PGPInstanceToShare: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
    PGPInstanceToShare.generateIdentity();

    const storageEngineFactory = new StorageEngine();
    const storageEngine = storageEngineFactory.getStorageEngine();
    storageEngine.setConfiguration({
        URL: 'http://localhost:3000',
        ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
        timeout: 2000
    });
    const documentSharing = new DocumentSharing(storageEngine);
    let firstUser: IKeys;
    let cid: string;
    let cidShared: string;
    let factoryInteraction: FactoryInteraction;
    let web3Provider: Web3Provider;
    let interaction: Interaction;

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        web3Provider = Web3Provider.getInstance();

        const web3 = new Web3(String(process.env.CLAM_BLOCKCHAIN_LOCALTION));
        const consentConfig = { address: process.env.CLAM_CONSENT_ADDRESS || '', abi: ABIConsent.abi as unknown as AbiItem };
        const accessConfig = { address: process.env.CLAM_ACCESS_ADDRESS || '', abi: ABIAccess.abi as unknown as AbiItem};
        const consentResourceConfig = { address: process.env.CLAM_CONSENT_RESOURCE_ADDRESS || '', abi: ABIConsentResource.abi as unknown as AbiItem};
        const IPFSManagementConfig = { address: process.env.CLAM_IPFS_ADDRESS || '', abi: ABIIPFSManagement.abi as unknown as AbiItem};
        web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);
        interaction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

        AESInstance.address = '0x8B3921DA1090CF8de6a34dcb929Be0df53AB81Fa';
        AESInstance.privateKey = '0a6a24eac9cd5adf1d4b447fdc3316623d362480d6a835da70860b4d4cb0f82f';

        PGPInstance.address = '0x8B3921DA1090CF8de6a34dcb929Be0df53AB81Fa';
        PGPInstance.privateKey = '0a6a24eac9cd5adf1d4b447fdc3316623d362480d6a835da70860b4d4cb0f82f';
        PGPInstance.publicKeySpecial = `-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n
        xjMEYxPc1xYJKwYBBAHaRw8BAQdAISEl5yOPoIrEsNid5TrO+AsWUWVeYwf1\n
        eVFkJTCPbMrNZTB4MWUxZjY4OTgyMjliMDhiOTY3ZGQxN2U2MTE1Zjg5MDZi\n
        MDA4MDQzMyA8MHgxZTFmNjg5ODIyOWIwOGI5NjdkZDE3ZTYxMTVmODkwNmIw\n
        MDgwNDMzQGxvY2FsaG9zdC5jb20+wowEEBYKAB0FAmMT3NcECwkHCAMVCAoE\n
        FgACAQIZAQIbAwIeAQAhCRA4wRQ+4Mv5GBYhBHy3yQxDQqK36+MXmTjBFD7g\n
        y/kYM/4A/0f2mVcSNB0iJYKSVK2E9ZT8ubB6eW+CkRb3Gvnq2IAnAQC400Wm\n
        Vh0JHr5sr3VJMf6sH+9YOrfkQ+FEouuebtKSCc44BGMT3NcSCisGAQQBl1UB\n
        BQEBB0B2/IRCPPEqYG4E78eT3r5X0xWyn+8+2YPu9/ZV5iVycgMBCAfCeAQY\n
        FggACQUCYxPc1wIbDAAhCRA4wRQ+4Mv5GBYhBHy3yQxDQqK36+MXmTjBFD7g\n
        y/kYWFEBAKS9Al6PI9IG8zLeO8y+EPTikvhNYvubUP1/BNUqbR12AP9MC7Fc\n
        sQOpqThNHpZiQS/f0wEdlqV7j6tVimnUit1DAw==\n=xhBn\n-----END PGP PUBLIC KEY BLOCK-----`;
        PGPInstance.privateKeySpecial = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n\n
        xYYEYxPc1xYJKwYBBAHaRw8BAQdAISEl5yOPoIrEsNid5TrO+AsWUWVeYwf1\n
        eVFkJTCPbMr+CQMIH5LUSZBxClHgLYFtKNFfBUKxMTtmOBBEftR7CuATrLf8\n
        SLRIoRqpXTjBCIfBtwvs1qApWOQPOJkSeTw8ocLSsf8fIUJ1hgOFPWWWxFES\n
        Is1lMHgxZTFmNjg5ODIyOWIwOGI5NjdkZDE3ZTYxMTVmODkwNmIwMDgwNDMz\n
        IDwweDFlMWY2ODk4MjI5YjA4Yjk2N2RkMTdlNjExNWY4OTA2YjAwODA0MzNA\n
        bG9jYWxob3N0LmNvbT7CjAQQFgoAHQUCYxPc1wQLCQcIAxUICgQWAAIBAhkB\n
        AhsDAh4BACEJEDjBFD7gy/kYFiEEfLfJDENCorfr4xeZOMEUPuDL+Rgz/gD/\n
        R/aZVxI0HSIlgpJUrYT1lPy5sHp5b4KRFvca+erYgCcBALjTRaZWHQkevmyv\n
        dUkx/qwf71g6t+RD4USi655u0pIJx4sEYxPc1xIKKwYBBAGXVQEFAQEHQHb8\n
        hEI88SpgbgTvx5PevlfTFbKf7z7Zg+739lXmJXJyAwEIB/4JAwh3gzs8Axv8\n
        sOBlBVssCRcdRqModA+NC6nK0JSUdaAZu2lo4j9ufJY+CFXBO77UyJDGuRnf\n
        UhzYjQDiFphUnJYNIH4bEbeHWgLD/mtm9trawngEGBYIAAkFAmMT3NcCGwwA\n
        IQkQOMEUPuDL+RgWIQR8t8kMQ0Kit+vjF5k4wRQ+4Mv5GFhRAQCkvQJejyPS\n
        BvMy3jvMvhD04pL4TWL7m1D9fwTVKm0ddgD/TAuxXLEDqak4TR6WYkEv39MB\n
        HZale4+rVYpp1IrdQwM=\n=P8nQ\n-----END PGP PRIVATE KEY BLOCK-----`;

        PGPInstanceToShare.address = '0x93120bA8FBb9eF2f6744C7d50803A4390E4eF961';
        PGPInstanceToShare.privateKey = '41582c42e41141d40b2e42ec53252a4f31a849758a115df2b8eb94fc1abfcc54';
        PGPInstanceToShare.publicKeySpecial = `-----BEGIN PGP PUBLIC KEY BLOCK-----\n\n
        xjMEYxPc1xYJKwYBBAHaRw8BAQdAISEl5yOPoIrEsNid5TrO+AsWUWVeYwf1\n
        eVFkJTCPbMrNZTB4MWUxZjY4OTgyMjliMDhiOTY3ZGQxN2U2MTE1Zjg5MDZi\n
        MDA4MDQzMyA8MHgxZTFmNjg5ODIyOWIwOGI5NjdkZDE3ZTYxMTVmODkwNmIw\n
        MDgwNDMzQGxvY2FsaG9zdC5jb20+wowEEBYKAB0FAmMT3NcECwkHCAMVCAoE\n
        FgACAQIZAQIbAwIeAQAhCRA4wRQ+4Mv5GBYhBHy3yQxDQqK36+MXmTjBFD7g\n
        y/kYM/4A/0f2mVcSNB0iJYKSVK2E9ZT8ubB6eW+CkRb3Gvnq2IAnAQC400Wm\n
        Vh0JHr5sr3VJMf6sH+9YOrfkQ+FEouuebtKSCc44BGMT3NcSCisGAQQBl1UB\n
        BQEBB0B2/IRCPPEqYG4E78eT3r5X0xWyn+8+2YPu9/ZV5iVycgMBCAfCeAQY\n
        FggACQUCYxPc1wIbDAAhCRA4wRQ+4Mv5GBYhBHy3yQxDQqK36+MXmTjBFD7g\n
        y/kYWFEBAKS9Al6PI9IG8zLeO8y+EPTikvhNYvubUP1/BNUqbR12AP9MC7Fc\n
        sQOpqThNHpZiQS/f0wEdlqV7j6tVimnUit1DAw==\n=xhBn\n-----END PGP PUBLIC KEY BLOCK-----`;
        PGPInstanceToShare.privateKeySpecial = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n\n
        xYYEYxPc1xYJKwYBBAHaRw8BAQdAISEl5yOPoIrEsNid5TrO+AsWUWVeYwf1\n
        eVFkJTCPbMr+CQMIH5LUSZBxClHgLYFtKNFfBUKxMTtmOBBEftR7CuATrLf8\n
        SLRIoRqpXTjBCIfBtwvs1qApWOQPOJkSeTw8ocLSsf8fIUJ1hgOFPWWWxFES\n
        Is1lMHgxZTFmNjg5ODIyOWIwOGI5NjdkZDE3ZTYxMTVmODkwNmIwMDgwNDMz\n
        IDwweDFlMWY2ODk4MjI5YjA4Yjk2N2RkMTdlNjExNWY4OTA2YjAwODA0MzNA\n
        bG9jYWxob3N0LmNvbT7CjAQQFgoAHQUCYxPc1wQLCQcIAxUICgQWAAIBAhkB\n
        AhsDAh4BACEJEDjBFD7gy/kYFiEEfLfJDENCorfr4xeZOMEUPuDL+Rgz/gD/\n
        R/aZVxI0HSIlgpJUrYT1lPy5sHp5b4KRFvca+erYgCcBALjTRaZWHQkevmyv\n
        dUkx/qwf71g6t+RD4USi655u0pIJx4sEYxPc1xIKKwYBBAGXVQEFAQEHQHb8\n
        hEI88SpgbgTvx5PevlfTFbKf7z7Zg+739lXmJXJyAwEIB/4JAwh3gzs8Axv8\n
        sOBlBVssCRcdRqModA+NC6nK0JSUdaAZu2lo4j9ufJY+CFXBO77UyJDGuRnf\n
        UhzYjQDiFphUnJYNIH4bEbeHWgLD/mtm9trawngEGBYIAAkFAmMT3NcCGwwA\n
        IQkQOMEUPuDL+RgWIQR8t8kMQ0Kit+vjF5k4wRQ+4Mv5GFhRAQCkvQJejyPS\n
        BvMy3jvMvhD04pL4TWL7m1D9fwTVKm0ddgD/TAuxXLEDqak4TR6WYkEv39MB\n
        HZale4+rVYpp1IrdQwM=\n=P8nQ\n-----END PGP PRIVATE KEY BLOCK-----`;

        interaction.setIdentity(AESInstance);
    });

    test('Should add new encrypted file', async () => {
        jest.spyOn(ConsentInteraction.prototype, 'getConsentById').mockImplementation(async () => await true);
        nock('http://localhost:3000')
            .post('/file')
            .reply(200, {
                CID: 'fe5c3e7fa0f43b8cbfed5e69c9a19c722c1900ff893ce7fa6b40646b88e46f48.txt'
            });

        const options = {
            file: fs.readFileSync(path.resolve(__dirname, './resources/test.txt')).toString('base64'),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1'
        };
             
        cid = await documentSharing.saveFile(AESInstance, options);

        expect(cid).not.toBe('');
    });

    test('Should get encrypted file', async () => {
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: AESInstance.address, cid: cid })
            .reply(200, {
                file: 'NGVjN2YxNDRmNjkyNzI0Mzk5YjdjYmYxYjIxZWUxMDJkMWExMDdmNDcxMWVhNDlkMzRhOWQ5OWMxMDljZTM2YlBXUStaY3FuYW4xb2tXTzJMNTdBN1E9PQ=='
            });

        const options = {
            cid: cid
        };

        const file = await documentSharing.getFile(AESInstance, options);
        
        expect(Buffer.from(file, 'base64').toString()).toBe('testV10');
    });

    test('Should update an encrypted file', async () => {
        const options = {
            file: fs.readFileSync(path.resolve(__dirname, './resources/testUpdate.txt')).toString('base64'),
            cid: cid
        };

        nock('http://localhost:3000')
            .get('/challenge')
            .query({ address: AESInstance.address })
            .reply(200, {
                'hash': '71baf499ea88cf4c4cf06b9480e48ffae11e987e49f0d6a6c7061f4f02a4b0d2'
            });

        nock('http://localhost:3000')
            .put('/file')
            .reply(200);

        await documentSharing.updateFile(AESInstance, options);
        
        const getOptions = {
            cid: cid
        };

        nock('http://localhost:3000')
            .get('/file')
            .query({ address: AESInstance.address, cid: cid })
            .reply(200, {
                file: 'MjViNjEzYzRkZGUxMDg2MzgyMzE2OWMyZmIwYTEzMmQyZDNiMGNhNTRjMjQwMzg2N2IxOGFkOWVkNjcyMWQ0YXNVWnIrSGIrbmE1WUVLTXVPWUVWdlE9PQ=='
            });

        const file = await documentSharing.getFile(AESInstance, getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testV11');
    });

    test('Should shared an encrypted file if the consent is approved', async () => {
        nock('http://localhost:3000')
            .post('/file')
            .reply(200, {
                CID: 'fe5c3e7fa0f43b8cbfed5e69c9a19c722c1900ff893ce7fa6b40646b88e46f48.txt'
            });

        firstUser = await keysGenerator.generateKeys({ name: 'first', email: 'first@email.com' });

        const PGPKeys = `${PGPInstanceToShare.publicKeySpecial},${firstUser.publicKey}`;

        const options = {
            file: fs.readFileSync(path.resolve(__dirname, './resources/test.txt')).toString('base64'),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1'
        };

        cidShared = await documentSharing.sharedFile(PGPInstance, options, PGPKeys);

        expect(cidShared).not.toBe('');

        jest.spyOn(AccessInteraction.prototype, 'giveAccess').mockImplementation(async() => await true);
        await interaction.accessInteraction.giveAccess(cidShared, 'AAA1', [PGPInstanceToShare.address], 'test.txt', PGPInstance);

        nock('http://localhost:3000')
            .get('/file')
            .query({ address: PGPInstance.address, cid: cidShared })
            .reply(200, {
                file: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjRESkk3TXhsV3d5dk1TQVFkQUNKUytLL2RBbE1MMmRncm1UYjZjT1ZoSTZXQXhCWE9uTnA0UFdLMHcKcEZRd1JxUVJ4NFlDNXF1T3BoSng0WExXMGRjamplTlVlYklBVEdScUlEbCtXRjY0M3VFZ01ENzV2UmxTCmhsV3BIN0pZd1Y0REpBWGdPNThPQ1E0U0FRZEE1QzVacGd1QmI3VGs4dW5IKzlPellkVGc5MXp3MWNrQgp0QzFtL2pzdkZtOHdDWXdWdU9qQ1M4SXJSU25OejlQN0k2SHRxNVF1a1VwR3R4ZERuTjFXbUR4UlRPSGEKdmVOaWtKVGRlcjJYTEtHT3dWNERKSTdNeGxXd3l2TVNBUWRBRFlTR0luWDF4SDdwQmxxVHBCd3RtWWhWCmVDV3NCeThnSGE1Z1F4UUw2RlV3aitXTFpWY01neElpY3NLd01QbUVrT3NXQS9FSi85TW1sbkYvN2U1cgp6NHFDQ0JRbTAzMjR1MEpTZzN2cXlHOFAwajBCTE5hYyt3enVna1RRRWRKOEl2YWd4NlFJQ0JwOUZkV08KS2gzcXRCekNUSzRGeXRpTDUxbE40VGswR1IyRHBMeTQ2bmJwSkZvaThJRmFWQytxCj0rWXFPCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0K'
            });

        const getOptions = {
            cid: cidShared,
            owner: PGPInstance.address,
            contractInteraction: interaction,
            consentId: 'AAA1'
        };
        jest.spyOn(AccessInteraction.prototype, 'checkAccess').mockImplementation(async() => await true);
        const file = await documentSharing.getSharedFile(PGPInstance, getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testV10');
    });

    test('Should get shared file if user is added on list to shared', async () => {
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: PGPInstance.address, cid: cidShared })
            .reply(200, {
                file: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjRESkk3TXhsV3d5dk1TQVFkQUNKUytLL2RBbE1MMmRncm1UYjZjT1ZoSTZXQXhCWE9uTnA0UFdLMHcKcEZRd1JxUVJ4NFlDNXF1T3BoSng0WExXMGRjamplTlVlYklBVEdScUlEbCtXRjY0M3VFZ01ENzV2UmxTCmhsV3BIN0pZd1Y0REpBWGdPNThPQ1E0U0FRZEE1QzVacGd1QmI3VGs4dW5IKzlPellkVGc5MXp3MWNrQgp0QzFtL2pzdkZtOHdDWXdWdU9qQ1M4SXJSU25OejlQN0k2SHRxNVF1a1VwR3R4ZERuTjFXbUR4UlRPSGEKdmVOaWtKVGRlcjJYTEtHT3dWNERKSTdNeGxXd3l2TVNBUWRBRFlTR0luWDF4SDdwQmxxVHBCd3RtWWhWCmVDV3NCeThnSGE1Z1F4UUw2RlV3aitXTFpWY01neElpY3NLd01QbUVrT3NXQS9FSi85TW1sbkYvN2U1cgp6NHFDQ0JRbTAzMjR1MEpTZzN2cXlHOFAwajBCTE5hYyt3enVna1RRRWRKOEl2YWd4NlFJQ0JwOUZkV08KS2gzcXRCekNUSzRGeXRpTDUxbE40VGswR1IyRHBMeTQ2bmJwSkZvaThJRmFWQytxCj0rWXFPCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0K'
            });

        const options = {
            cid: cidShared,
            owner: PGPInstance.address,
            contractInteraction: interaction,
            consentId: 'AAA1'
        };

        const file = await documentSharing.getSharedFile(PGPInstanceToShare, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testV10');
    });

    test('Should not get shared file if the identity is not on list to shared', async () => {
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: PGPInstance.address, cid: cidShared })
            .reply(200, {
                file: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjRESkk3TXhsV3d5dk1TQVFkQUNKUytLL2RBbE1MMmRncm1UYjZjT1ZoSTZXQXhCWE9uTnA0UFdLMHcKcEZRd1JxUVJ4NFlDNXF1T3BoSng0WExXMGRjamplTlVlYklBVEdScUlEbCtXRjY0M3VFZ01ENzV2UmxTCmhsV3BIN0pZd1Y0REpBWGdPNThPQ1E0U0FRZEE1QzVacGd1QmI3VGs4dW5IKzlPellkVGc5MXp3MWNrQgp0QzFtL2pzdkZtOHdDWXdWdU9qQ1M4SXJSU25OejlQN0k2SHRxNVF1a1VwR3R4ZERuTjFXbUR4UlRPSGEKdmVOaWtKVGRlcjJYTEtHT3dWNERKSTdNeGxXd3l2TVNBUWRBRFlTR0luWDF4SDdwQmxxVHBCd3RtWWhWCmVDV3NCeThnSGE1Z1F4UUw2RlV3aitXTFpWY01neElpY3NLd01QbUVrT3NXQS9FSi85TW1sbkYvN2U1cgp6NHFDQ0JRbTAzMjR1MEpTZzN2cXlHOFAwajBCTE5hYyt3enVna1RRRWRKOEl2YWd4NlFJQ0JwOUZkV08KS2gzcXRCekNUSzRGeXRpTDUxbE40VGswR1IyRHBMeTQ2bmJwSkZvaThJRmFWQytxCj0rWXFPCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0K'
            });

        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        instance.generateIdentity();

        const options = {
            cid: cidShared,
            owner: PGPInstance.address,
            contractInteraction: interaction,
            consentId: 'AAA1'
        };

        jest.spyOn(AccessInteraction.prototype, 'checkAccess').mockImplementation(async () => Promise.reject(new Error('Returned error: Error: VM Exception while processing transaction: reverted with reason string \'You don\'t have permission over this resource\'')));
        await expect(documentSharing.getSharedFile(instance, options)).rejects.toThrow('Returned error: Error: VM Exception while processing transaction: reverted with reason string \'You don\'t have permission over this resource\'');
    });

    test('Should not shared an encrypted file if the consent is not approved', async () => {
        try{
            firstUser = await keysGenerator.generateKeys({ name: 'first', email: 'first@email.com' });

            const PGPKeys = `${PGPInstanceToShare.publicKeySpecial},${firstUser.publicKey}`;

            const options = {
                file: fs.readFileSync(path.resolve(__dirname, './resources/test.txt')).toString('base64'),
                fileName: 'test.txt',
                contractInteraction: interaction,
                consentId: 'AAA2'
            };

            jest.spyOn(ConsentInteraction.prototype, 'getConsentById').mockImplementation(async () => Promise.reject(new Error('Returned error: Error: VM Exception while processing transaction: reverted with reason string \'Consent not registered\'')));
            cidShared = await documentSharing.sharedFile(PGPInstance, options, PGPKeys);

            expect(cidShared).not.toBe('');
            const getOptions = {
                cid: cidShared,
                owner: PGPInstance.address
            };

            await documentSharing.getSharedFile(PGPInstance, getOptions);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe('Returned error: Error: VM Exception while processing transaction: reverted with reason string \'Consent not registered\'');
        }
    });

    test('Should not get an encrypted file when the identity does not own the file', async () => {
        const instance: IdentityManager = factoryIdentity.generateIdentity('PGP', 'PGP');
        instance.generateIdentity();
        
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: instance.address, cid: cid })
            .reply(404, {
                message: 'File not found'
            });

        const options = {
            cid: cid
        };
        
        await expect(documentSharing.getFile(instance, options)).rejects.toThrow('Request failed with status code 404');
    });

    test('Should not add new encrypted file if consent is not approved', async () => {
        nock('http://localhost:3000')
            .post('/file')
            .reply(200, {
                CID: 'fe5c3e7fa0f43b8cbfed5e69c9a19c722c1900ff893ce7fa6b40646b88e46f48.txt'
            });

        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA2'
        };
                
        await expect(documentSharing.saveFile(AESInstance, options)).rejects.toThrow('Returned error: Error: VM Exception while processing transaction: reverted with reason string \'Consent not registered\'');
    });
});
