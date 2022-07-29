import { IdentityManager } from '../src';
import FactoryIdentity from "../src/factoryIdentity/FactoryIdentity";

import { TextEncoder, TextDecoder } from "util";
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

describe('Testing IdentityManager class', () => {
  const factoryIdentity: FactoryIdentity = new FactoryIdentity();



  test('should the instance of the IdentityManager class have the correct structure', () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");

    const objectKeys: string[] = Object.keys(instance);
    expect(objectKeys.includes("mnemonic")).toBe(true);
    expect(objectKeys.includes("address")).toBe(true);
    expect(objectKeys.includes("privateKey")).toBe(true);
    expect(objectKeys.includes("publicKey")).toBe(true);
    expect(objectKeys.includes("publicKeyPGP")).toBe(true);
    expect(objectKeys.includes("privateKeyPGP")).toBe(true);
    expect(objectKeys.includes("encryptionLayer")).toBe(true);
    expect(objectKeys.includes("keysGenerator")).toBe(true);
    expect(objectKeys.includes("generateIdentity")).toBe(true);
    expect(objectKeys.length).toBe(9);
  });


  test('should throw an error if the keyGenerator property is not implemented.', async () => {
    try {
      const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
      await instance.generateIdentity();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Please set a specific implementation of keysGenerator");
    }

  });
  test('should the mnmonic property length be equal to 0', () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    expect(instance.mnemonic.length).toBe(0);
  });

  test('should the mnemonic property have a string with 12 words', async () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    await instance.generateIdentity();
    expect(instance.mnemonic.length).toBeGreaterThan(0);
    expect(instance.mnemonic.split(" ").length).toBe(12);
  });

  test('should the address property length be equal to 0', () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    expect(instance.address.length).toBe(0);
  });

  test('should the address property length be diferent to 0 and equal to 42', async () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    await instance.generateIdentity();
    expect(instance.address.length).toBeGreaterThan(0);
    expect(instance.address.length).toBe(42);
  });

  test('should the privateKey property length be equal to 0', () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    expect(instance.privateKey.length).toBe(0);
  });

  test('should the privateKey property length be diferent to 0 and equal to 64', async () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    await instance.generateIdentity();
    expect(instance.privateKey.length).toBe(64);
  });

  test('should the publicKey property length be equal to 0', () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    expect(instance.publicKey.length).toBe(0);
  });

  test('should the publicKey property length be diferent to 0 and equal to 66', async () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    await instance.generateIdentity();
    expect(instance.publicKey.length).toBe(66);
  });

  test('The publicKeyPGP and privateKeyPGP properties must have a size greater than 0.', async () => {
    const instance: IdentityManager = factoryIdentity.generateIdentity("pgp", "pgp");
    await instance.generateIdentity();
    expect(instance.publicKeyPGP.toString().trim().length).toBeGreaterThan(0);
    expect(instance.privateKeyPGP.toString().trim().length).toBeGreaterThan(0);
  });
});
