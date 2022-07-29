import "reflect-metadata";
import { container } from "tsyringe";
import IOption from "./IOption";
import { EncryptioLayerAES, EncryptionLayerPGP } from "../encryptionLayer";
import { KeysGeneratorPGP } from "../keysGenerator"
import {IdentityManager} from "../indentityManager";

class FactoryIdentity {
    private optionsEncryption: IOption[]
    private keysGenerators: IOption[]

    constructor() {
        this.optionsEncryption = [
            { name: "aes", option: EncryptioLayerAES },
            { name: "pgp", option: EncryptionLayerPGP },
        ]
        this.keysGenerators = [
            { name: "pgp", option: KeysGeneratorPGP }
        ]

    }
    setOptionEncryption(optionEncryption: IOption) {
        const optionEncryptionExist = this.optionsEncryption.find(option => option.name === optionEncryption.name);
        if (optionEncryptionExist) {
            throw new Error("This option already exists.");
        }
        this.optionsEncryption.push(optionEncryption);
    }
    setOptionKeysGenerator(keysGenerator: IOption) {
        const optionKeysGenerator = this.keysGenerators.find(option => option.name === keysGenerator.name);
        if (optionKeysGenerator) {
            throw new Error("This option already exists.");
        }
        this.keysGenerators.push(keysGenerator);
    }

    generateIdentity(encryptionType: string, generatorKeysType: string): IdentityManager {
        const encryptionLayer = this.optionsEncryption.find(option => option.name.toLowerCase() === encryptionType.toLowerCase());
        const keysGenerator = this.keysGenerators.find(option => option.name.toLowerCase() === generatorKeysType.toLowerCase());

        if (!encryptionLayer) {
            throw new Error("The encryptionLayer type doesn't exist");
        }
        if (!keysGenerator) {
            throw new Error("The keysGenerator type doesn't exist");
        }
        container.register("EncryptionLayer", encryptionLayer.option);
        container.register("KeysGenerator", keysGenerator.option);

        const identity = container.resolve(IdentityManager);

        return identity;
    }

}

export default FactoryIdentity;