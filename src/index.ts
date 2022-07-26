import EncryptionLayer from "./encryptionLayer/EncryptioLayerPGP";
import IdentityManager from "./indentityManager/IdentityManager";
import ShareableIdentity from "./indentityManager/ShareableIdentity";
import IEncryptionLayer from "./encryptionLayer/IEncryptionLayer";

// const generateIdentityMethod = async () => {
//     console.log("\n-->This is the implementation of generateIdentity method<--");
//     try {
//         const identity: IdentityManager = new IdentityManager();
//         await identity.generateIdentity();
//         console.log(identity);
//     } catch (error) {
//         console.log(error);
//     }
// }

// const generateIdentitiesMethod = async () => {
//     console.log("\n-->This is the implementation of the generateIdentities method<--");
//     try {
//         const identity: IdentityManager = new IdentityManager();
//         await identity.generateIdentity();
//         const shareable: ShareableIdentity = new ShareableIdentity(identity);
//         await shareable.generateIdentities(5);
//         console.log(shareable.identities);
//     } catch (error) {
//         console.log(error);
//     }
// }

// const encryptDataMethod = async () => {
//     console.log("\n-->This is the implementation of the encryptData method<--");
//     try {
//         const identity: IdentityManager = new IdentityManager();
//         await identity.generateIdentity();
//         const simpleMessage = "Hello bowhead";
//         const messageEncrypted: string = await identity.encryptionLayer.ecryptData(identity.publicKeyPGP, simpleMessage);

//         console.log("Simple Message");
//         console.log(simpleMessage);
//         console.log("\nMessage encrypted");
//         console.log(messageEncrypted);
//     } catch (error) {
//         console.log(error);
//     }
// }

// const decryptDataMethod = async () => {
//     console.log("\n-->This the implementation of the decryptData method<--");
//     try {
//         const identity: IdentityManager = new IdentityManager();
//         await identity.generateIdentity();
//         const messageEncrypted: string = await identity.encryptionLayer.ecryptData(identity.publicKeyPGP, "Hello bowhead");
//         const messageDecrypted: string = await identity.encryptionLayer.decryptData(identity.privateKeyPGP, messageEncrypted);

//         console.log("Message encrypted");
//         console.log(messageEncrypted);
//         console.log("\nMessage decrypted");
//         console.log(messageDecrypted);
//     } catch (error) {
//         console.log(error);
//     }
// }

// const main = async () => {
//     try {
//         await generateIdentityMethod();
//         await generateIdentitiesMethod();
//         await encryptDataMethod();
//         await decryptDataMethod();
//     } catch (error) {
//         console.log(error);
//     }
// }

// main();

export {
    IdentityManager,
    ShareableIdentity,
    EncryptionLayer,
    IEncryptionLayer
};
