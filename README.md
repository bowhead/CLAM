# CLAM

## About

CLAM stands for Consent and Content Access Management Library. It is a users' data privacy first and extensible tool that abstracts the complexity of different technologies, like blockchain and IPFS. 

Using blockchain as basis, CLAM helps developers to focus on the implementation of their solution and not worry about technical details of two common cases when a system is built to handle sensitive data:

* Consent: Acquiring users' consent where they agree to share their delicate data is a challenge. With an anonymous, decentralized and immutable consent, the users’ enrollment increases by giving them the option to quit at any time they want, propagating the change to all linked systems without no effort.

* Content access management: the users’ can decide when and with whom the information is shared, everything is handled by smart contracts whose main purpose is to decentralize the logic and make the process transparent for all the stakeholders. The information is always encrypted and cannot be accessed by anyone except the user owner and those that she decided to share, who could be a doctor, researchers or any actor that the user trusts.

## Table of Contents
- [Requirements](#requirements)
- [Getting Started](#getting-started)
	- [Installing](#installing)
	- [Usage](#usage)
- [Examples](#examples)
	- [How to create an identity](#how-to-create-an-identity)
	- [How to accept a consent](#how-to-accept-a-consent)
	- [How to share a document with other accounts](#how-to-share-a-document-with-other-accounts)
	- [How to decrypt a shared document by other account](#how-to-decrypt-a-shared-document-by-other-account)
	- [How to encrypt, save and decrypt a document using AES](#how-to-encrypt-save-and-decrypt-a-document-using-aes)
	- [How to encrypt, save and decrypt a document using Open PGP](#how-to-encrypt-save-and-decrypt-a-document-using-open-pgp)
	- [Use a custom encryption algorithm](#use-a-custom-encryption-algorithm)
	<!-- - [Use a custom storage engine](#use-a-custom-storage-engine) -->
- [License](#license)

## Requirements

- NodeJS
- npm (Node.js package manager)

## Getting started

####  Installing

Using npm:

```bash
$ npm install bowhead-clam
```

####  Usage

ES6:
```ts

import * as clam from 'bowhead-clam';

```

Modular include:

```js

const { IdentityManager } = require('bowhead-clam');

```

Including all libraries,

```js

const clam = require('bowhead-clam');

```

## Examples

### How to create an identity

```ts
// Load IdentityManager module
import { IdentityManager } from "bowhead-clam";

const  generateIdentityMethod  =  async  ()  =>  {
	try  {
		const  identity : IdentityManager = new IdentityManager();

		await  identity.generateIdentity();
	}  catch  (error)  {
		console.log(error);
	}
}
```

<!-- Generate your identities based on the main identity  in **Javascript**
```js
const { IdentityManager, ShareableIdentity } = require("bowhead-clam");
const  generateIdentitiesMethod  =  async  ()  =>  {
	try  {
		const  identity  =  new  IdentityManager();
		await  identity.generateIdentity();
		const  shareable  =  new  ShareableIdentity(identity);
		await  shareable.generateIdentities(5);
		console.log(shareable.identities);
	}  catch  (error)  {
		console.log(error);
	}
}
``` -->
<!-- Generate your identities based on the main identity  in **Typescript**
```ts
import { ShareableIdentity, IdentityManager } from "bowhead-clam";
const  generateIdentitiesMethod  =  async  ()  =>  {
	try  {
		const  identity:  IdentityManager  =  new  IdentityManager();
		await  identity.generateIdentity();
		const  shareable:  ShareableIdentity  =  new  ShareableIdentity(identity);
		await  shareable.generateIdentities(5);
		console.log(shareable.identities);
	}  catch  (error)  {
		console.log(error);
	}
}
``` -->


<!-- Encrypt a string using the public PGP key in **Javascript**
```js
const { IdentityManager } = require("bodhead-clam");
const  encryptDataMethod  =  async  ()  =>  {
	try  {
		const  identity  =  new  IdentityManager();
		await  identity.generateIdentity();
		const  simpleMessage  =  "Hello bowhead";
		const  messageEncrypted  =  await  identity.encryptionLayer.ecryptData(identity.publicKeyPGP,  simpleMessage);
		console.log("Simple Message");
		console.log(simpleMessage);
		console.log("\nMessage encrypted");
		console.log(messageEncrypted);
	}  catch  (error)  {
		console.log(error);
	}
}
``` -->
<!-- Encrypt a string using the public PGP key in **Typescript**
```ts
import { IdentityManager } from "bowhead-clam"; 
const  encryptDataMethod  =  async  ()  =>  {
	try  {
		const  identity:  IdentityManager  =  new  IdentityManager();
		await  identity.generateIdentity();
		const  simpleMessage  =  "Hello bowhead";
		const  messageEncrypted:  string  =  await  identity.encryptionLayer.ecryptData(identity.publicKeyPGP,  simpleMessage);
		console.log("Simple Message");
		console.log(simpleMessage);
		console.log("\nMessage encrypted");
		console.log(messageEncrypted);
	}  catch  (error)  {
		console.log(error);
	}
}
``` -->


<!-- Decrypt a string the message encrypted an the private PGP key **Javascript**
```js
const { IdentityManager } = require("bodhead-clam");
const  decryptDataMethod  =  async  ()  =>  {
	try  {
		const  identity  =  new  IdentityManager();
		await  identity.generateIdentity();
		const  messageEncrypted  =  await  identity.encryptionLayer.ecryptData(identity.publicKeyPGP,  "Hello bowhead");
		const  messageDecrypted  =  await  identity.encryptionLayer.decryptData(identity.privateKeyPGP,  messageEncrypted);
		console.log("Message encrypted");
		console.log(messageEncrypted);
		console.log("\nMessage decrypted");
		console.log(messageDecrypted);
	}  catch  (error)  {
		console.log(error);
	}
}
``` -->

<!-- Decrypt a string the message encrypted an the private PGP key **Typescript** -->

<!-- import { IdentityManager } from "bowhead-clam";
const  decryptDataMethod  =  async  ()  =>  {
	try  {
		const  identity:  IdentityManager  =  new  IdentityManager();
		await  identity.generateIdentity();
		const  messageEncrypted:  string  =  await  identity.encryptionLayer.ecryptData(identity.publicKeyPGP,  "Hello bowhead");
		const  messageDecrypted:  string  =  await  identity.encryptionLayer.decryptData(identity.privateKeyPGP,  messageEncrypted);
		console.log("Message encrypted");
		console.log(messageEncrypted);
		console.log("\nMessage decrypted");
		console.log(messageDecrypted);
	}  catch  (error)  {
		console.log(error);
	}
} -->


### How to accept a consent
Load modules, create instances and initialized them.
```js
// Load Web3Provider, FactoryIdentity and FactoryInteraction modules
import { Web3Provider, FactoryIdentity, FactoryInteraction } from 'bowhead-clam';
// Load Web3 library
import Web3 from 'web3';

// Create  new FactoryIdentity instance
const factoryIdentity = new FactoryIdentity();
// Create new FactoryInteraction instance
const factoryInteraction = new FactoryInteraction();
// Create instance to interact with smart contracts
const cotractInteraction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

// Get identity instance that will use Open PGP to encrypt files
const identity = factoryIdentity.generateIdentity('PGP', 'PGP');

// Generate identity info
identity.generateIdentity();

// Get web3 provider instance
const web3Provider = Web3Provider.getInstance();
```

Set Web3 provider configuration.
```js
// Set provider
const web3 = new Web3(urlProvider);

// Set address and ABI for Consent contract
const consentConfig = { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent };
// Set address and ABI for Access contract
const accessConfig = { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess };
// Set address and ABI for Consent Resource contract
const consentResourceConfig = { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412', abi: ABIConsentResource };
// Set address and ABI for IPFS management contract
const IPFSManagementConfig = { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement };

// Set Web3 provider configuration
web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);
```

Save consent approval.
```js
// Consent identifier
const consentId = 'AAA1'

// Call saveConsent that it's contained in consentInteraction
await interaction.consentInteraction.saveConsent(consentId, identity);
```

### How to share a document with other accounts
Load modules, create instances and initialized them.
```js
// Load Web3Provider, FactoryIdentity and FactoryInteraction modules
import { Web3Provider, FactoryIdentity, FactoryInteraction } from 'bowhead-clam';
// Load Web3 library
import Web3 from 'web3';

// Create  new FactoryIdentity instance
const factoryIdentity = new FactoryIdentity();
// Create new FactoryInteraction instance
const factoryInteraction = new FactoryInteraction();
// Create instance to interact with smart contracts
const cotractInteraction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

// Get identity instance that will use Open PGP to encrypt files
const identity = factoryIdentity.generateIdentity('PGP', 'PGP');

// Generate identity info
identity.generateIdentity();

// Get web3 provider instance
const web3Provider = Web3Provider.getInstance();
```

Set Web3 provider configuration.
```js
// Set provider
const web3 = new Web3(urlProvider);

// Set address and ABI for Consent contract
const consentConfig = { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent };
// Set address and ABI for Access contract
const accessConfig = { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess };
// Set address and ABI for Consent Resource contract
const consentResourceConfig = { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412', abi: ABIConsentResource };
// Set address and ABI for IPFS management contract
const IPFSManagementConfig = { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement };

// Set Web3 provider configuration
web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);
```

Add new user to allowed list to share documents by consent.
```js
// Consent Identifier
const consentId = 'AAA1'
// Address of the user to add
const addressUserToShare = '0x93120bA8FBb9eF2f6744C7d50803A4390E4eF961'
// PGP public key of the user to add
const publicPGPKeyUserToShare = '-----BEGIN PGP PUBLIC KEY BLOCK----- ...'

// Call addKey that it's contained in consentInteraction
await interaction.consentInteraction.addKey(consentId, addressUserToShare, publicPGPKeyUserToShare, identity);
```

### How to decrypt a shared document by other account
Load modules, create instances and initialized them.
```js
// Load Web3Provider, FactoryIdentity, FactoryInteraction, StorageEngine and DocumentSharing modules
import { Web3Provider, FactoryIdentity, FactoryInteraction, StorageEngine, DocumentSharing } from 'bowhead-clam';
// Load Web3 library
import Web3 from 'web3';

// Create  new FactoryIdentity instance
const factoryIdentity = new FactoryIdentity();
// Create new FactoryInteraction instance
const factoryInteraction = new FactoryInteraction();
// Create instance to interact with smart contracts
const cotractInteraction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

// Get identity instance that will use Open PGP to encrypt files
const identity = factoryIdentity.generateIdentity('PGP', 'PGP');

// Generate identity info
identity.generateIdentity();

// Get web3 provider instance
const web3Provider = Web3Provider.getInstance();

// Create a new instance of StorageEngine and pass the configuration
const storageEngine: IStorageEngine = new StorageEngine({
	URL: 'http://localhost:3000',
	ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
	timeout: 2000
	});

// Create DocumentSharing instance
const documentSharing = new DocumentSharing(storageEngine);
```

Set Web3 provider configuration.
```js
// Set provider
const web3 = new Web3(urlProvider);

// Set address and ABI for Consent contract
const consentConfig = { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent };
// Set address and ABI for Access contract
const accessConfig = { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess };
// Set address and ABI for Consent Resource contract
const consentResourceConfig = { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412', abi: ABIConsentResource };
// Set address and ABI for IPFS management contract
const IPFSManagementConfig = { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement };

// Set Web3 provider configuration
web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);
```

Get shared file.
```js
const options = {
	cid: 'fe5c3e7fa0f43b8cbfed5e69c9a19c722c1900ff893ce7fa6b40646b88e46f48.txt', // CID file
	owner: '0x93120bA8FBb9eF2f6744C7d50803A4390E4eF961', // File owner address
	contractInteraction: cotractInteraction, // ContractInteraction instance
	consentId: 'SHARED' // Consent identifier
};

// Call getSharedFile function, return file in base64
const file = await documentSharing.getSharedFile(identity, options); // => 'dGVzdFYxMA=='
```

### How to encrypt, save and decrypt a document using AES
Load modules, create instances and initialized them.
```js
// Load Web3Provider, FactoryIdentity, FactoryInteraction, StorageEngine and DocumentSharing modules
import { Web3Provider, FactoryIdentity, FactoryInteraction, StorageEngine, DocumentSharing } from 'bowhead-clam';
// Load Web3 library
import Web3 from 'web3';

// Create  new FactoryIdentity instance
const factoryIdentity = new FactoryIdentity();
// Create new FactoryInteraction instance
const factoryInteraction = new FactoryInteraction();
// Create instance to interact with smart contracts
const cotractInteraction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

// Get identity instance that will use AES to encrypt files
const identity = factoryIdentity.generateIdentity('AES', 'PGP');

// Generate identity info
identity.generateIdentity();

// Get web3 provider instance
const web3Provider = Web3Provider.getInstance();

// Create a new instance of StorageEngine and pass the configuration
const storageEngine: IStorageEngine = new StorageEngine({
	URL: 'http://localhost:3000',
	ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
	timeout: 2000
	});

// Create DocumentSharing instance
const documentSharing = new DocumentSharing(storageEngine);
```

Set Web3 provider configuration.
```js
// Set provider
const web3 = new Web3(urlProvider);

// Set address and ABI for Consent contract
const consentConfig = { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent };
// Set address and ABI for Access contract
const accessConfig = { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess };
// Set address and ABI for Consent Resource contract
const consentResourceConfig = { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412', abi: ABIConsentResource };
// Set address and ABI for IPFS management contract
const IPFSManagementConfig = { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement };

// Set Web3 provider configuration
web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);
```

Save encrypted file with AES.
```js
const options = {
	file: 'dGVzdFYxMA==', // File in base64
	fileName: 'test.txt', // File name
	contractInteraction: cotractInteraction, // ContractInteraction instance
	consentId: 'AAA1' // Consent identifier
};

// Call save file function
const cid = await documentSharing.saveFile(identity, options);

// Save file register on IPFS Management contract
await contractInteraction.IPFSManagementInteraction.addFile(cid, options.fileName, identity);
```

Get encrypted file with AES.
```js
const options = {
	cid: cid // CID file
};

// Call getFile function, return file in base64
const file = await documentSharing.getFile(identity, options);
```

### How to encrypt, save and decrypt a document using Open PGP
Load modules, create instances and initialized them.
```js
// Load Web3Provider, FactoryIdentity, FactoryInteraction, StorageEngine and DocumentSharing modules
import { Web3Provider, FactoryIdentity, FactoryInteraction, StorageEngine, DocumentSharing } from 'bowhead-clam';
// Load Web3 library
import Web3 from 'web3';

// Create  new FactoryIdentity instance
const factoryIdentity = new FactoryIdentity();
// Create new FactoryInteraction instance
const factoryInteraction = new FactoryInteraction();
// Create instance to interact with smart contracts
const cotractInteraction = factoryInteraction.generateInteraction('clam', 'clam', 'clam');

// Get identity instance that will use Open PGP to encrypt files
const identity = factoryIdentity.generateIdentity('PGP', 'PGP');

// Generate identity info
identity.generateIdentity();

// Get web3 provider instance
const web3Provider = Web3Provider.getInstance();

// Create a new instance of StorageEngine and pass the configuration
const storageEngine: IStorageEngine = new StorageEngine({
	URL: 'http://localhost:3000',
	ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
	timeout: 2000
	});

// Create DocumentSharing instance
const documentSharing = new DocumentSharing(storageEngine);
```

Set Web3 provider configuration.
```js
// Set provider
const web3 = new Web3(urlProvider);

// Set address and ABI for Consent contract
const consentConfig = { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent };
// Set address and ABI for Access contract
const accessConfig = { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess };
// Set address and ABI for Consent Resource contract
const consentResourceConfig = { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412', abi: ABIConsentResource };
// Set address and ABI for IPFS management contract
const IPFSManagementConfig = { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement };

// Set Web3 provider configuration
web3Provider.setConfig(web3, consentConfig, accessConfig, consentResourceConfig, IPFSManagementConfig);
```

Save encrypted file with Open PGP
```js
const options = {
	file: 'dGVzdFYxMA==', // File in base64
	fileName: 'test.txt', // File name
	contractInteraction: cotractInteraction, // ContractInteraction instance
	consentId: 'AAA1' // Consent identifier
};

// Get the list of users allowed to share files by consent
const usersToShare = await contractInteraction.consentInteraction.getKeys(options.consentId, options.identity);

// Save file encrypted with Open GPG
const cid = await documentSharing.sharedFile(identity, options, usersToShare.pgpKeys);

// Save file register on IPFS Management contract
await contractInteraction.IPFSManagementInteraction.addFile(cid, options.fileName, identity);

// Add the address of the users who can get the file in the Access contract
await this.contractInteraction.acccessInteraction.giveAccess(cid, options.consentId, [options.identity.address], options.fileName, options.identity);
```

// Get encrypted file with Open PGP
```js
const getOptions = {
	cid: cid, // CID file
	owner: '0x93120bA8FBb9eF2f6744C7d50803A4390E4eF961', // File owner address
	contractInteraction: cotractInteraction, // ContractInteraction instance
	consentId: 'SHARED1' // Consent identifier
};

// Call getSharedFile function, return file in base64
const fileShared1 = await documentSharing.getSharedFile(identity, getOptions);
```

### Use a custom encryption algorithm
Create new implementation based on IEncryptionLayer
```js
import { IEncryptionLayer } from 'bowhead-clam'

/**
 * Class EncryptionLayerLULU
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
```

Register the new implementation
```js
// Load FactoryIndentity module
import { FactoryIdentity } from 'bowhead-clam'

// Create new FactoryIdentity instance
const factoryIdentity = new FactoryIdentity();

// Register a new encryption implementation
factoryIdentity.setOptionEncryption({ name: 'LULU', option: EncryptionLayerLULU });

// Get an identity instance that will use the new encryption implementation
const identity: IdentityManager = factoryIdentity.generateIdentity('LULU', 'PGP');
```

## License
[MIT](LICENSE)

