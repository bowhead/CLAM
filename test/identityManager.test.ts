import { IdentityManager } from '../src';
import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

describe('Testing IdentityManager class', () => {
  const instance: IdentityManager = new IdentityManager();
  instance.generateIdentity();

  test('should the instance of the IdentityManager class have the correct structure', () => {
    const objectKeys: string[] = Object.keys(instance);
    expect(objectKeys.includes("mnemonic")).toBe(true);
    expect(objectKeys.includes("address")).toBe(true);
    expect(objectKeys.includes("privateKey")).toBe(true);
    expect(objectKeys.includes("publicKey")).toBe(true);
    expect(objectKeys.includes("publicKeyPGP")).toBe(true);
    expect(objectKeys.includes("privateKeyPGP")).toBe(true);
    expect(objectKeys.includes("encryptionLayer")).toBe(true);
    expect(objectKeys.includes("generateIdentity")).toBe(true);
    expect(objectKeys.length).toBe(8);
  });

  test('should the mnmonic property length be equal to 0', () => {
    const internalInstance: IdentityManager = new IdentityManager();
    expect(internalInstance.mnemonic.length).toBe(0);
  });

  test('should the mnemonic property have a string with 12 words', () => {
    expect(instance.mnemonic.length).toBeGreaterThan(0);
    expect(instance.mnemonic.split(" ").length).toBe(12);
  });

  test('should the address property length be equal to 0', () => {
    const internalInstance: IdentityManager = new IdentityManager();
    expect(internalInstance.address.length).toBe(0);
  });

  test('should the address property length be diferent to 0 and equal to 42', () => {
    expect(instance.address.length).toBeGreaterThan(0);
    expect(instance.address.length).toBe(42);
  });

  test('should the privateKey property length be equal to 0', () => {
    const internalInstance: IdentityManager = new IdentityManager();
    expect(internalInstance.privateKey.length).toBe(0);
  });

  test('should the privateKey property length be diferent to 0 and equal to 64', () => {
    expect(instance.privateKey.length).toBe(64);
  });

  test('should the publicKey property length be equal to 0', () => {
    const internalInstance: IdentityManager = new IdentityManager();
    expect(internalInstance.publicKey.length).toBe(0);
  });

  test('should the publicKey property length be diferent to 0 and equal to 66', () => {
    expect(instance.publicKey.length).toBe(66);
  });

  test('The publicKeyPGP and privateKeyPGP properties must have a size other than 0.', () => {
    expect(instance.publicKeyPGP.toString().trim().length).toBeGreaterThan(0);
    expect(instance.privateKeyPGP.toString().trim().length).toBeGreaterThan(0);
  });
});
