import { 
    DocumentSharing,
    IdentityManager,
    FactoryIdentity,
    IStorageEngine,
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
import Web3Provider from '../src/contractIntegration/interaction/Wbe3Provider';
import { AccessInteraction, ConsentInteraction, FactoryInteraction ,Interaction } from '../src/contractIntegration';
import nock from "nock";

describe('Testing document sharing', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();
    const keysGeneratos: IKeysGenerator = new KeysGeneratorPGP();

    const aesInstance: IdentityManager = factoryIdentity.generateIdentity('aes', 'pgp');
    aesInstance.generateIdentity();

    const pgpInstance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
    pgpInstance.generateIdentity();

    const pgpInstanceToShare: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
    pgpInstanceToShare.generateIdentity();

    const storageEngine: IStorageEngine = new StorageEngine({
        URL: 'http://localhost:3000',
        ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
        timeout: 2000
    })
    const documentSharing = new DocumentSharing(storageEngine);
    let firstUser : IKeys;
    let cid: string;
    let cidShared: string;
    let factoryInteraction: FactoryInteraction;
    let web3Provider: Web3Provider;
    let interaction: Interaction;

    afterAll(() => {
        jest.restoreAllMocks();
    })

    beforeEach(() => {
        factoryInteraction = new FactoryInteraction();
        web3Provider = Web3Provider.getInstance();

        const urlProvider = 'http://localhost:8545';
        const consentConfig = { address: '0x0E801D84Fa97b50751Dbf25036d067dCf18858bF', abi: ABIConsent.abi };
        const accessConfig = { address: '0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00', abi: ABIAccess.abi };
        const consentResourceConfig = { address: '0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf', abi: ABIConsentResource.abi };
        web3Provider.setConfig(urlProvider, consentConfig, accessConfig, consentResourceConfig);

        interaction = factoryInteraction.generateInteraction('clam', 'clam');

        aesInstance.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        aesInstance.privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

        pgpInstance.address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        pgpInstance.privateKey = 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
        pgpInstance.privateKeySpecial = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n\n
        xYYEYwJShBYJKwYBBAHaRw8BAQdAieeepcV/Rwi+fEyC7Vg/btVIbK+sljsA\n
        h7jc5wqHwgP+CQMI4SSA1ZunQmXgR1k7VBxWDph+WYHZaTEUlAk/FD7TDQPH\n
        6+gFfPxjwDoi2QDUeF5LQZIiJAu2iF6hnmLlG4d6QATNS6HQDcPwz9wznWrd\n
        G81lMHgzZmU4OWQzNTM4Njk5ZWZiYjZjMjYyNTQ2YWZlZDQ5MzQ0MTcxYTk1\n
        IDwweDNmZTg5ZDM1Mzg2OTllZmJiNmMyNjI1NDZhZmVkNDkzNDQxNzFhOTVA\n
        bG9jYWxob3N0LmNvbT7CjAQQFgoAHQUCYwJShAQLCQcIAxUICgQWAAIBAhkB\n
        AhsDAh4BACEJEJg3MgXeYx2EFiEEY26Uvly3JjUkYvXSmDcyBd5jHYSUJAD7\n
        BHICtm2d3fKRPiQeuzS9zHuSmFG9+tpJNOtak6zM2rsA/RxvYi/wITtPhzPM\n
        QicbN8xtAqyjlSz5bjlPqOzqAVsOx4sEYwJShBIKKwYBBAGXVQEFAQEHQHrc\n
        jzqHkGcs13B6JqSU64hSUUPIVo3xi4xvpiG6zHVxAwEIB/4JAwhRcLP5XiBl\n
        7eAw5ZRJe8OGVRJTI/cikyck55tAwM5yXXGZQyvDoW0bzAvyIAVeYe4VoMC5\n
        2ygjXiYuTGB/qTgVoL5uzdV8IPkZT5rDv+E3wngEGBYIAAkFAmMCUoQCGwwA\n
        IQkQmDcyBd5jHYQWIQRjbpS+XLcmNSRi9dKYNzIF3mMdhP/tAP9m7l+5NzPn\n
        nt//5rumqxIxmqswSpnGYJuHaWka82j/3AEA0wDpkTboL4KbSPaiVZzUKCtD\n
        IfICvDdmN0GG8WAqVwg=\n=rQnr\n-----END PGP PRIVATE KEY BLOCK-----`

        pgpInstanceToShare.address = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
        pgpInstanceToShare.privateKey = '59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
        pgpInstanceToShare.privateKeySpecial = `-----BEGIN PGP PRIVATE KEY BLOCK-----\n\n
        xYYEYwJShBYJKwYBBAHaRw8BAQdAieeepcV/Rwi+fEyC7Vg/btVIbK+sljsA\n
        h7jc5wqHwgP+CQMI4SSA1ZunQmXgR1k7VBxWDph+WYHZaTEUlAk/FD7TDQPH\n
        6+gFfPxjwDoi2QDUeF5LQZIiJAu2iF6hnmLlG4d6QATNS6HQDcPwz9wznWrd\n
        G81lMHgzZmU4OWQzNTM4Njk5ZWZiYjZjMjYyNTQ2YWZlZDQ5MzQ0MTcxYTk1\n
        IDwweDNmZTg5ZDM1Mzg2OTllZmJiNmMyNjI1NDZhZmVkNDkzNDQxNzFhOTVA\n
        bG9jYWxob3N0LmNvbT7CjAQQFgoAHQUCYwJShAQLCQcIAxUICgQWAAIBAhkB\n
        AhsDAh4BACEJEJg3MgXeYx2EFiEEY26Uvly3JjUkYvXSmDcyBd5jHYSUJAD7\n
        BHICtm2d3fKRPiQeuzS9zHuSmFG9+tpJNOtak6zM2rsA/RxvYi/wITtPhzPM\n
        QicbN8xtAqyjlSz5bjlPqOzqAVsOx4sEYwJShBIKKwYBBAGXVQEFAQEHQHrc\n
        jzqHkGcs13B6JqSU64hSUUPIVo3xi4xvpiG6zHVxAwEIB/4JAwhRcLP5XiBl\n
        7eAw5ZRJe8OGVRJTI/cikyck55tAwM5yXXGZQyvDoW0bzAvyIAVeYe4VoMC5\n
        2ygjXiYuTGB/qTgVoL5uzdV8IPkZT5rDv+E3wngEGBYIAAkFAmMCUoQCGwwA\n
        IQkQmDcyBd5jHYQWIQRjbpS+XLcmNSRi9dKYNzIF3mMdhP/tAP9m7l+5NzPn\n
        nt//5rumqxIxmqswSpnGYJuHaWka82j/3AEA0wDpkTboL4KbSPaiVZzUKCtD\n
        IfICvDdmN0GG8WAqVwg=\n=rQnr\n-----END PGP PRIVATE KEY BLOCK-----`

        interaction.setIdentity(aesInstance);
    });

    test('Should add new encrypted file', async () => {
        jest.spyOn(ConsentInteraction.prototype, 'getConsentById').mockImplementation(async() => await true);
        nock('http://localhost:3000')
            .post('/file')
            .reply(200, {
                    CID: 'fe5c3e7fa0f43b8cbfed5e69c9a19c722c1900ff893ce7fa6b40646b88e46f48.txt'
            })

        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1'
        };
             
        cid = await documentSharing.saveFile(aesInstance, options);

        expect(cid).not.toBe('');
    });

    test('Should get encrypted file', async () => {
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: aesInstance.address, cid: cid })
            .reply(200, {
                    file: 'ZTE3YmUzZGUzYTg0MDQ0OWM5MGM2YTRhYTVkZGI2YmZkODdlNzQxZmE0M2M3ZDc4NDQwNjdlOTcyOWRjYTllY2R1b3o5bGxEUW1aSmUvRGI2d1hiK3c9PQ=='
            })

        const options = {
            cid: cid
        }

        const file = await documentSharing.getFile(aesInstance, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should update an encrypted file', async() => {
        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/testUpdate.txt')),
            cid: cid
        };

        nock('http://localhost:3000')
            .get('/challenge')
            .query({ address: aesInstance.address })
            .reply(200, {
                'hash': '71baf499ea88cf4c4cf06b9480e48ffae11e987e49f0d6a6c7061f4f02a4b0d2'
            });

        nock('http://localhost:3000')
            .put('/file')
            .reply(200);

        await documentSharing.updateFile(aesInstance, options);
        
        const getOptions = {
            cid: cid
        };

        nock('http://localhost:3000')
            .get('/file')
            .query({ address: aesInstance.address, cid: cid })
            .reply(200, {
                file: 'NWNiMmU4NzBlNWVhYmJiZWE1ZmViN2ZhZGYyNWU1NzE1ZWNhMGUxZTJjMjE5NDI1NWU1Zjk0YmYzNDVjMjg0M1ZaNG9JbEZQdmorTEluZ3VQaUhUMVE9PQ=='
            });

        const file = await documentSharing.getFile(aesInstance, getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv11');
    })

    test('Should shared an encrypted file if the consent is approved', async () => {
        nock('http://localhost:3000')
            .post('/file')
            .reply(200, {
                    CID: 'fe5c3e7fa0f43b8cbfed5e69c9a19c722c1900ff893ce7fa6b40646b88e46f48.txt'
            })

        firstUser = await keysGeneratos.generateKeys({ name: 'first', email: 'first@email.com' });

        const pgpKeys = `${pgpInstanceToShare.publicKeySpecial},${firstUser.publicKey}`;

        const options = {
            file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
            fileName: 'test.txt',
            contractInteraction: interaction,
            consentId: 'AAA1'
        }

        cidShared = await documentSharing.sharedFile(pgpInstance, options, pgpKeys);

        expect(cidShared).not.toBe('');

        jest.spyOn(AccessInteraction.prototype, 'giveAccess').mockImplementation(async() => await '');
        await interaction.acccessInteraction.giveAccess(cidShared, 'AAA1', [pgpInstanceToShare.address], 'test.txt', pgpInstance);

        nock('http://localhost:3000')
            .get('/file')
            .query({ address: pgpInstance.address, cid: cidShared })
            .reply(200, {
                file: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjREOXNlYlo4cTN2UzRTQVFkQXFOVjJJbE14REhTTUFWVjRTN0lPeEVqbEpzZS9XejIyQjluZHZQSWgKMnlNd2xPc2NzRWVwQ0VjNXFaT3hjOElOcnA1Snh1Z3ArbkU2bGh2aHFPYzRNdTJKblB3ZG1Bd3h5d3F5CnppbWlER3dld1Y0RHNER05FdDhmMlY4U0FRZEFkQXZyalVGdGdKS2RlMDJ0QzJEUkswZXA2RWcwMnZIYworQzVPeTBpTUZpWXdCbTFsY3lwYnBhajJ1a01TYzlvTkUvcXdlYzZLZmVjdnl3cWs3S2pSZzltdXJoN1YKalBDM3IyMHFHd1lJR3E4MXdWNERHZHdsWnB6cVo5OFNBUWRBR1czUC9lS0wxZ2lFQjFYdFZnZ2E1ZmxXCkVkaytoS0tPZzNQcE4rSXZvbTB3ZGpXSFZBbFFRVzBremxUYndwZC9HOXpWVi9WRFpQRlJyQmF3RVhsZQo0RTBEdlRYVU8zRDVLRkRyVnJFeStCSVUwajBCQlFtUXZBY1hYeURTcEJManNzUFF2K2ZpUnZzSzhjNDAKb2x3Z1ZVT1QxSkxiTGlEayt5RmZXcEJGZmFIa3R6WU01RlR6SHZFbXRZZXVFYTU2Cj1vaFh3Ci0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0K'
            })

        const getOptions = {
            cid: cidShared,
            owner: pgpInstance.address,
            contractInteraction: interaction,
            consentId: 'AAA1'
        }
        jest.spyOn(AccessInteraction.prototype, 'checkAccess').mockImplementation(async() => await true);
        const file = await documentSharing.getSharedFile(pgpInstance, getOptions);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should get shared file if user is added on list to shared', async () => {
        nock('http://localhost:3000')
            .get('/file')
            .query({ address: pgpInstance.address, cid: cidShared })
            .reply(200, {
                file: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjREOXNlYlo4cTN2UzRTQVFkQXFOVjJJbE14REhTTUFWVjRTN0lPeEVqbEpzZS9XejIyQjluZHZQSWgKMnlNd2xPc2NzRWVwQ0VjNXFaT3hjOElOcnA1Snh1Z3ArbkU2bGh2aHFPYzRNdTJKblB3ZG1Bd3h5d3F5CnppbWlER3dld1Y0RHNER05FdDhmMlY4U0FRZEFkQXZyalVGdGdKS2RlMDJ0QzJEUkswZXA2RWcwMnZIYworQzVPeTBpTUZpWXdCbTFsY3lwYnBhajJ1a01TYzlvTkUvcXdlYzZLZmVjdnl3cWs3S2pSZzltdXJoN1YKalBDM3IyMHFHd1lJR3E4MXdWNERHZHdsWnB6cVo5OFNBUWRBR1czUC9lS0wxZ2lFQjFYdFZnZ2E1ZmxXCkVkaytoS0tPZzNQcE4rSXZvbTB3ZGpXSFZBbFFRVzBremxUYndwZC9HOXpWVi9WRFpQRlJyQmF3RVhsZQo0RTBEdlRYVU8zRDVLRkRyVnJFeStCSVUwajBCQlFtUXZBY1hYeURTcEJManNzUFF2K2ZpUnZzSzhjNDAKb2x3Z1ZVT1QxSkxiTGlEayt5RmZXcEJGZmFIa3R6WU01RlR6SHZFbXRZZXVFYTU2Cj1vaFh3Ci0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0K'
            })

        const options = {
            cid: cidShared,
            owner: pgpInstance.address,
            contractInteraction: interaction,
            consentId: 'AAA1'
        }

        const file = await documentSharing.getSharedFile(pgpInstanceToShare, options);

        expect(Buffer.from(file, 'base64').toString()).toBe('testv10');
    });

    test('Should not get shared file if the identity is not on list to shared', async () => {
        try {
            nock('http://localhost:3000')
            .get('/file')
            .query({ address: pgpInstance.address, cid: cidShared })
            .reply(200, {
                file: 'LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tCgp3VjREK0N3dUxRbWRnL0lTQVFkQS8vMXFrbVFFaHlIeWNlQXIzc0xyZCtoZXVvTWU2djEwR29kendpbFQKd1Fzd3g5NGtXa3NOY0tNTkM3aFlTSEZFeTRpME5pMU1HOGdXU0U3YUtCNmxJQnB4SGpUZU1raERUMWRVCjdCQ1NLRWRpd1Y0RDF6aHpTbU96Z0lnU0FRZEF5VXdpUVJvb0wrZnR4Z1FXdG9YaGJ1d1h0OVdhazRIYQphN05kUWJnOGFDWXdkODZzZ1dFRW13cmFqakg2NFBkRThvNWR1ay9zZXJwV3pLWWFTV2cwRUVhWFFCYU0KUFI2QTRIYllSZi9LT0tRa3dWNERsaE1sNEw0NkJFQVNBUWRBaUR6dVJGWnRtWEhUYjVrY1lJRm9lMXhtCmtJdC9sdHVKMVdiSVNYUGRUakF3VTJiek1pbm1uNDVRczBWbzZNMWE4NWo3c2Z1UTNzVEJwREd1Y21ySwpDSnJJT1FxQ2tzV1BUbkRDb1VxV2dnMGIwajBCTUZJYnlHSzFsMjNKTVUyTUZ1SFZxeXRLQXI1b3NFZk0KWjdnRlZkWVpOVTIxQ1U3TWVLSEdvems1UDVhOWpTbzV3VGFSZ01vaTNQanVQN3BOCj1WMGV0Ci0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0K'
            })

            const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
            instance.generateIdentity();

            const options = {
                cid: cidShared,
                owner: pgpInstance.address,
                contractInteraction: interaction,
                consentId: 'AAA1'
            };

            await documentSharing.getSharedFile(instance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect([
                `Error decrypting message: Session key decryption failed.`,
                `Returned error: Error: VM Exception while processing transaction: reverted with reason string 'You don't have permission over this resource'`
            ]).toContain(error.message);
        }
    });

    test('Should not shared an encrypted file if the consent is not approved', async () => {
        try {
            firstUser = await keysGeneratos.generateKeys({ name: 'first', email: 'first@email.com' });

            const pgpKeys = `${pgpInstanceToShare.publicKeySpecial},${firstUser.publicKey}`;

            const options = {
                file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
                fileName: 'test.txt',
                contractInteraction: interaction,
                consentId: 'AAA2'
            }

            jest.spyOn(ConsentInteraction.prototype, 'getConsentById').mockImplementation(async () => Promise.reject(new Error(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'Consent not registered'`)));
            cidShared = await documentSharing.sharedFile(pgpInstance, options, pgpKeys);

            expect(cidShared).not.toBe('');

            const getOptions = {
                cid: cidShared,
                owner: pgpInstance.address
            }

            await documentSharing.getSharedFile(pgpInstance, getOptions);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'Consent not registered'`);
        }
    });

    test('Should not get an encrypted file when the identity does not own the file', async () => {
        try {
            const instance: IdentityManager = factoryIdentity.generateIdentity('pgp', 'pgp');
            instance.generateIdentity();

            nock('http://localhost:3000')
            .get('/file')
            .query({ address: instance.address, cid: cid })
            .reply(404, {
                message: 'File not found'
            })

            const options = {
                cid: cid
            };
            
            await documentSharing.getFile(instance, options);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.response.data.message).toBe('File not found');
        }
    });

    test('Should not add new encrypted file if consent is not approved', async () => {
        try {
            nock('http://localhost:3000')
            .post('/file')
            .reply(200, {
                    CID: 'fe5c3e7fa0f43b8cbfed5e69c9a19c722c1900ff893ce7fa6b40646b88e46f48.txt'
            })

            const options = {
                file: fs.createReadStream(path.resolve(__dirname, './resources/test.txt')),
                fileName: 'test.txt',
                contractInteraction: interaction,
                consentId: 'AAA2'
            };
                 
            await documentSharing.saveFile(aesInstance, options);   
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(`Returned error: Error: VM Exception while processing transaction: reverted with reason string 'Consent not registered'`);
        }
    });
});
