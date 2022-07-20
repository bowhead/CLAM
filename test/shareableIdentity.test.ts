import { ShareableIdentity, IdentityManager } from '../src';
import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
describe('Testing ShareableIdentity class', () => {

    test('The instance of the ShareableIdentity class should have the correct structure', () => {
        const mainIdentity: IdentityManager = new IdentityManager();
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
        const mainIdentity: IdentityManager = new IdentityManager();
        await mainIdentity.generateIdentity();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        await shareable.generateIdentities(5);
        const { identities } = shareable;
        expect(identities.length).toBe(5);
    });

    test('should not genereta identities if the main identity is not generated', async () => {
        const mainIdentity: IdentityManager = new IdentityManager();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        await shareable.generateIdentities(5);
        const { identities } = shareable;
        expect(identities.length).toBe(0);
    });

    test('should increse by 5 the property lastIdentity when the user wants 4 identities', async () => {
        const mainIdentity: IdentityManager = new IdentityManager();
        await mainIdentity.generateIdentity();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        await shareable.generateIdentities(4);
        const { lastIdentity } = shareable;
        expect(lastIdentity).toBe(5);
    });

    test('should not increse the property lastIdentity when the user wants 4 identities', () => {
        const mainIdentity: IdentityManager = new IdentityManager();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        shareable.generateIdentities(4);
        const { lastIdentity } = shareable;
        expect(lastIdentity).toBe(1);
    });

    test('should return an specific IdentityManager by index', async () => {
        const mainIdentity: IdentityManager = new IdentityManager();
        await mainIdentity.generateIdentity();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        await shareable.generateIdentities(4);
        const identity: IdentityManager = shareable.getIdentityByIndex(1);
        expect(identity).not.toBe(null);
        expect(identity).toEqual(shareable.getIdentityByIndex(1));
    });

    test('should return an empty object if the mainIdentity is not generated', async () => {
        const mainIdentity: IdentityManager = new IdentityManager();
        const shareable: ShareableIdentity = new ShareableIdentity(mainIdentity);
        await shareable.generateIdentities(4);
        const identity: IdentityManager = shareable.getIdentityByIndex(1);
        const { mnemonic, address, publicKey, privateKey } = identity;

        expect(mnemonic).toBe("");
        expect(address).toBe("");
        expect(publicKey).toBe("");
        expect(privateKey).toBe("");

    });


});