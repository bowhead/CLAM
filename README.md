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
	- [Use a custom contract interaction](#use-a-custom-contract-interaction)
	- [Use a custom storage engine](#use-a-custom-storage-engine)
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
// Load FactoryWeb3Interaction, FactoryIdentity and FactoryInteraction modules
import { FactoryWeb3Interaction, FactoryIdentity, FactoryInteraction } from 'bowhead-clam';

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
const factoryWeb3Provider = FactoryWeb3Interaction.getInstance();
```

Set Web3 provider configuration.
```js
// Provider configuration
const interactionConfig = {
	// Set URL provider
	provider: 'http://localhost:8545',
	// Set chain ID
	chainId: 13,
	// Set address and ABI for Consent contract
	consent: { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent },
	// Set address and ABI for Access contract
	access: { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess },
	// Set address and ABI for Consent Resource contract
	consentResource: { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412'), abi: ABIConsentResource },
	// Set address and ABI for IPFS management contract
	ipfs: { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement }
}

// Set Web3 provider configuration
factoryWeb3Provider.setConfig(interactionConfig);
```

Save consent approval.
```js
// Consent identifier
const consentId = 'AAA1'

// Call saveConsent that it's contained in consentInteraction
await cotractInteraction.consentInteraction.saveConsent(consentId, identity);
```

### How to share a document with other accounts
Load modules, create instances and initialized them.
```js
// Load FactoryWeb3Interaction, FactoryIdentity and FactoryInteraction modules
import { FactoryWeb3Interaction, FactoryIdentity, FactoryInteraction } from 'bowhead-clam';

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
const factoryWeb3Provider = FactoryWeb3Interaction.getInstance();
```

Set Web3 provider configuration.
```js
// Provider configuration
const interactionConfig = {
	// Set URL provider
	provider: 'http://localhost:8545',
	// Set chain ID
	chainId: 13,
	// Set address and ABI for Consent contract
	consent: { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent },
	// Set address and ABI for Access contract
	access: { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess },
	// Set address and ABI for Consent Resource contract
	consentResource: { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412'), abi: ABIConsentResource },
	// Set address and ABI for IPFS management contract
	ipfs: { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement }
}

// Set Web3 provider configuration
factoryWeb3Provider.setConfig(interactionConfig);
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
await cotractInteraction.consentInteraction.addKey(consentId, addressUserToShare, publicPGPKeyUserToShare, identity);
```

### How to decrypt a shared document by other account
Load modules, create instances and initialized them.
```js
// Load FactoryWeb3Interaction, FactoryIdentity, FactoryInteraction, StorageEngine and DocumentSharing modules
import { FactoryWeb3Interaction, FactoryIdentity, FactoryInteraction, StorageEngine, DocumentSharing } from 'bowhead-clam';

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
const factoryWeb3Provider = FactoryWeb3Interaction.getInstance();

// Create a new instance of StorageEngine and pass the configuration
const storageEngineFactory = new StorageEngine();
const storageEngine = storageEngineFactory.getStorageEngine();
storageEngine.setConfiguration({
	URL: 'http://localhost:3000',
	ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
	timeout: 2000
});

// Create DocumentSharing instance
const documentSharing = new DocumentSharing(storageEngine);
```

Set Web3 provider configuration.
```js
// Provider configuration
const interactionConfig = {
	// Set URL provider
	provider: 'http://localhost:8545',
	// Set chain ID
	chainId: 13,
	// Set address and ABI for Consent contract
	consent: { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent },
	// Set address and ABI for Access contract
	access: { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess },
	// Set address and ABI for Consent Resource contract
	consentResource: { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412'), abi: ABIConsentResource },
	// Set address and ABI for IPFS management contract
	ipfs: { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement }
}

// Set Web3 provider configuration
factoryWeb3Provider.setConfig(interactionConfig);
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
// Load FactoryWeb3Interaction, FactoryIdentity, FactoryInteraction, StorageEngine and DocumentSharing modules
import { FactoryWeb3Interaction, FactoryIdentity, FactoryInteraction, StorageEngine, DocumentSharing } from 'bowhead-clam';

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
const factoryWeb3Provider = FactoryWeb3Interaction.getInstance();

// Create a new instance of StorageEngine and pass the configuration
const storageEngineFactory = new StorageEngine();
const storageEngine = storageEngineFactory.getStorageEngine();
storageEngine.setConfiguration({
	URL: 'http://localhost:3000',
	ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
	timeout: 2000
});

// Create DocumentSharing instance
const documentSharing = new DocumentSharing(storageEngine);
```

Set Web3 provider configuration.
```js
// Provider configuration
const interactionConfig = {
	// Set URL provider
	provider: 'http://localhost:8545',
	// Set chain ID
	chainId: 13,
	// Set address and ABI for Consent contract
	consent: { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent },
	// Set address and ABI for Access contract
	access: { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess },
	// Set address and ABI for Consent Resource contract
	consentResource: { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412'), abi: ABIConsentResource },
	// Set address and ABI for IPFS management contract
	ipfs: { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement }
}

// Set Web3 provider configuration
factoryWeb3Provider.setConfig(interactionConfig);
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
// Load FactoryWeb3Interaction, FactoryIdentity, FactoryInteraction, StorageEngine and DocumentSharing modules
import { FactoryWeb3Interaction, FactoryIdentity, FactoryInteraction, StorageEngine, DocumentSharing } from 'bowhead-clam';

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
const factoryWeb3Provider = FactoryWeb3Interaction.getInstance();

// Create a new instance of StorageEngine and pass the configuration
const storageEngineFactory = new StorageEngine();
const storageEngine = storageEngineFactory.getStorageEngine();
storageEngine.setConfiguration({
	URL: 'http://localhost:3000',
	ApiKey: 'wXW9c5NObnsrZIY1J3Tqhvz4cZ7YQrrKnbJpo9xOqJM=',
	timeout: 2000
});

// Create DocumentSharing instance
const documentSharing = new DocumentSharing(storageEngine);
```

Set Web3 provider configuration.
```js
// Provider configuration
const interactionConfig = {
	// Set URL provider
	provider: 'http://localhost:8545',
	// Set chain ID
	chainId: 13,
	// Set address and ABI for Consent contract
	consent: { address: '0x09Fe1b1A9Cd73F35945Bfdc0378c9aCC227c0DBF', abi: ABIConsent },
	// Set address and ABI for Access contract
	access: { address: '0x82E54b8B226b007704D1203f0951138338CB921F', abi: ABIAccess },
	// Set address and ABI for Consent Resource contract
	consentResource: { address: '0x639c9197aB9be745A6D2CB6cB8c2d46D7BB9A412'), abi: ABIConsentResource },
	// Set address and ABI for IPFS management contract
	ipfs: { address: '0xB19Fb08e183fF19989792ceD10325BF0C45CCd27', abi: ABIIPFSManagement }
}

// Set Web3 provider configuration
factoryWeb3Provider.setConfig(interactionConfig);
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
await contractInteraction.acccessInteraction.giveAccess(cid, options.consentId, [options.identity.address], options.fileName, options.identity);
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

### Use a custom contract interaction
Create new implementation for consent based on IConsentInteraction
```js
// Load IConsentInteraction module
import { IConsentInteraction } from 'bowhead-clam'

class ConsentInteractionOther implements IConsentInteraction {
    /**
     * This function saves a consent with the information passed as parameters. 
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} return the address of the transaction.
     */
    async saveConsent(consentId: string, identity: IdentityManager): Promise<boolean> {
        return consentId && identity ? true : false;
    }
    /**
     * This function cancel a consent based in the consentID passed in th eparameter.
     * @param {string} consentId This parameter is the consentID to identify consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} return the address of the transaction.
     */
    async cancelConsent(consentId: string, identity: IdentityManager): Promise<boolean> {
        return consentId && identity? true : false;
    }

    /**
     * This function return the consent status based in the consentID passed in the parameter.
     * @param {string} consentId This parameters is the consentID to indentify the consent.
     * @param {string} owner This parameter is the owner addres.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction.
     * @returns {Promise<boolean>} return the consent status. 
     */
    async getConsentById(consentId: string, owner: string, identity: IdentityManager): Promise<boolean> {
        return consentId && owner && identity ? true : false;
    }

    /**
     * This funtion add a key in a consent based in the consentID in the case if the consent has already been acepted.
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {string} addressConsent This parameter is the adressConsent to indentify the consent.
     * @param {string} key  This parameter is the key to be added in the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<boolean>}  return the address of the transaction.  
     */
    async addKey(consentId: string, addressConsent: string, key: string, identity: IdentityManager): Promise<boolean> {
        return consentId && addressConsent && identity && key? true : false;
    }

    /**
     * This funtion return the addres's and keys's the consent based in the consentId.
     * @param {string} consentId This parameter is the consentID to indentify the consent.
     * @param {IdentityManager} identity This parameter is the Identity to configurate the smart contract interaction. 
     * @returns {Promise<any>} return the addres's and keys's
     */
    async getKeys(consentId: string, identity: IdentityManager): Promise<IConsentKeys> {
        return {'0': [consentId], '1': [identity? '': '']};
    }
}
```

Register the new implementation
```js
// Load FactoryInteraction
import { FactoryInteraction } from 'bowhead-clam';

// Create a factory interaction instance
const factoryInteraction = new FactoryInteraction();

// Set the new implementation
factoryInteraction.setOptionConsentInteraction({ name: 'other', option: ConsentInteractionOther });

// Get the contract interaction and pass the name of the new implementation as a parameter
const contractInteraciton = factoryInteraction.generateInteraction('other', 'clam', 'clam');
```
> **_NOTE:_** 
The function ```generateInteraction``` receive three parameters, the first corresponds to ConsentInteraction, the second to AccessInteraction and the third to IPFSManagementInteraction.
>
> Pass ```'clam'``` to keep the deault implementation.

### Use a custom storage engine
Create new implementation based on IStorageEngine
```js
// Load IStorageEngine module
import { IStorageEngine } from 'bowhead-clam'

/**
 * Temporal file type
 */
class TemporalFile {
	name: string;
	cid: string;
	file: string;
}

/**
 * Temporal file search
 */
class TemporalFileSearch {
	cid: string;
}

/**
 * Temporal storage engine
 */
class TemporalEngine implements IStorageEngine {
	private files = new Array<TemporalFile>;

	/**
	 * Save temporal file
	 * @param {object} options - File to save and additional parameters
	 * @returns {string} returns the file identifier or location
	 */
	async saveFile(options: object): Promise<string> {
		const fileInfo = options as TemporalFile;
		const cid = (Math.random() + 1).toString(36).substring(7);
		fileInfo.cid = cid;
		this.files.push(fileInfo);
		return cid;
	}

	/**
	 * Get file from storage engine
	 * @param {object} options - File identifier or location and additional parameters
	 * @returns {string} returns the file
	 */
	async getFile(options: object): Promise<string> {
		const fileInfo = options as TemporalFileSearch;
		
		const file = this.files.find(file => {
			return file.cid === fileInfo.cid;
		});

		return file?.file || '';
	}

	/**
	 * Update file stored
	 * @param {object} options - File identifier or location and additional parameters
	 */
	async updateFile(options: object): Promise<void> {
		const fileInfo = options as TemporalFile;

		const index = this.files.findIndex((file => file.cid === fileInfo.cid));

		this.files[index].file = fileInfo.file;
	}

	/**
	 * Delete file from storage engine
	 * @param {object} options - Identifier of the file to delete and additional parameters
	 */
	async deleteFile(options: object): Promise<void> {
		const fileInfo = options as TemporalFileSearch;

		const index = this.files.map(file => file.cid).indexOf(fileInfo.cid);

		this.files.splice(index, 1);
	}

	/**
	 * Set storage options
	 * @param {object} options - Configuration options
	 */
	setConfiguration(options: object): void {
		console.error(options);
	}
}
```

Register the new implementation
```js
// Load StorageEngine module
import { StorageEngine } from 'bowhead-clam';

// Create a storage engine instance and pass the new implementation as a parameter in the constructor
const storageEngineFactory = new StorageEngine(TemporalEngine);

// Get storage engine
const storageEngine = storageEngineFactory.getStorageEngine();
```

## License
[MIT](LICENSE)

