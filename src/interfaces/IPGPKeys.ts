/**
 * This interface represents the structure that an object 
 * must have when being returned with pgp key information.
 */
interface IPGPKeys {
    privateKeyPGP: string;
    publicKeyPGP: string;
}

export default IPGPKeys; 