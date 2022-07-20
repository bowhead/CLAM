# CLAM

###  Getting started

####  Node.js

```sh

npm i bowhead-clam

```

Javascript

```js

const clam = require('bowhead-clam');

```
Typescrypt
```ts

import * as clam from 'bowhead-clam';
```

Generate your identity in **Javascript**

```js
const  { IdentityManager, ShareableIdentity }  =  require("bowhead-clam");
const  generateIdentityMethod  =  async  ()  =>  {
	console.log("\n-->This is the implementation of generateIdentity method<--");
	try  {
		const  identity  =  new  IdentityManager();
		await  identity.generateIdentity();
		console.log(identity);
	}  catch  (error)  {
		console.log(error);
	}
}
```

Generate your identity in **Typescript**

```ts
import { IdentityManager } from "bowhead-clam";
const  generateIdentityMethod  =  async  ()  =>  {
	console.log("\n-->This is the implementation of generateIdentity method<--");
	try  {
		const  identity:  IdentityManager  =  new  IdentityManager();
		await  identity.generateIdentity();
		console.log(identity);
	}  catch  (error)  {
		console.log(error);
	}
}
```

Generate your identities based on the main identity  in **Javascript**
```js
const { IdentityManager, ShareableIdentity } = require("bowhead-clam");
const  generateIdentitiesMethod  =  async  ()  =>  {
	console.log("\n-->This is the implementation of the generateIdentities method<--");
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
```
Generate your identities based on the main identity  in **Typescript**
```ts
import { ShareableIdentity, IdentityManager } from "bowhead-clam";
const  generateIdentitiesMethod  =  async  ()  =>  {
	console.log("\n-->This is the implementation of the generateIdentities method<--");
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
```


Encrypt a string using the public PGP key in **Javascript**
```js
const { IdentityManager } = require("bodhead-clam");
const  encryptDataMethod  =  async  ()  =>  {
	console.log("\n-->This is the implementation of the encryptData method<--");
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
```
Encrypt a string using the public PGP key in **Typescript**
```ts
import { IdentityManager } from "bowhead-clam"; 
const  encryptDataMethod  =  async  ()  =>  {
	console.log("\n-->This is the implementation of the encryptData method<--");
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
```


Decrypt a string the message encrypted an the private PGP key **Javascript**
```js
const { IdentityManager } = require("bodhead-clam");
const  decryptDataMethod  =  async  ()  =>  {
	console.log("\n-->This the implementation of the decryptData method<--");
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
```

Decrypt a string the message encrypted an the private PGP key **Typescript**
```ts
import { IdentityManager } from "bowhead-clam";
const  decryptDataMethod  =  async  ()  =>  {
	console.log("\n-->This the implementation of the decryptData method<--");
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
}
```


