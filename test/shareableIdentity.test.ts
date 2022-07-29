import {
    ShareableIdentity,
    IdentityManager,
    FactoryIdentity
} from '../src';
import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
describe('Testing ShareableIdentity class', () => {
    const factoryIdentity: FactoryIdentity = new FactoryIdentity();

    test('The instance of the ShareableIdentity class should have the correct structure', () => {
        const mainIdentity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        const shareableKeys: string[] = Object.keys(shareable);

        expect(shareableKeys.includes("mainIdentity")).toBe(true);
        expect(shareableKeys.includes("identities")).toBe(true);
        expect(shareableKeys.includes("lastIdentity")).toBe(true);
        expect(shareableKeys.includes("getIdentityByIndex")).toBe(true);
        expect(shareableKeys.includes("generateIdentities")).toBe(true);
        expect(shareableKeys.length).toBe(5);
    });

    test('should generate 5 identities based on the main identity', async () => {
        const mainIdentity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
        await mainIdentity.generateIdentity();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        await shareable.generateIdentities(5);
        const { identities } = shareable;
        expect(identities.length).toBe(5);
    });

    test('should not genereta identities if the main identity is not generated', async () => {
        try {
            const mainIdentity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
            const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
            await shareable.generateIdentities(5);
            const { identities } = shareable;
            expect(identities.length).toBe(0);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The main identity has to be initialized");
        }
    });

    test('should increse by 5 the property lastIdentity when the user wants 4 identities', async () => {
        const mainIdentity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp")

        await mainIdentity.generateIdentity();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        await shareable.generateIdentities(4);
        const { lastIdentity } = shareable;
        expect(lastIdentity).toBe(5);
    });

    test('should not increse the property lastIdentity when the user wants 4 identities', async () => {
        try {
            const mainIdentity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp")
            const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
            shareable.generateIdentities(4);
            const { lastIdentity } = shareable;
            expect(lastIdentity).toBe(1);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The main identity has to be initialized");
        }
    });

    test('should return an specific IdentityManager by index', async () => {
        const mainIdentity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
        await mainIdentity.generateIdentity();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        await shareable.generateIdentities(4);
        const identity: IdentityManager = shareable.getIdentityByIndex(1);
        expect(identity).not.toBe(null);
        expect(identity).toEqual(shareable.getIdentityByIndex(1));
    });

    test('should return an empty object if the mainIdentity is not generated', async () => {
        try {
            const mainIdentity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp")
            const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
            await shareable.generateIdentities(4);
            shareable.getIdentityByIndex(1);

        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("The main identity has to be initialized");
        }
    });
    test('should throw an error if the position is less than 1', async () => {
        try {
            const mainIdentity: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp")
            const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
            await shareable.generateIdentities(4);
            shareable.getIdentityByIndex(-1);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Position must be equal or greater than 0");
        }
    });

});