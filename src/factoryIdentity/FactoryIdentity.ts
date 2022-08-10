import "reflect-metadata";
import { container } from "tsyringe";
import IOption from "./IOption";
import { EncryptioLayerAES, EncryptionLayerPGP } from "../encryptionLayer";
import { KeysGeneratorPGP } from "../keysGenerator"
import { IdentityManager } from "../indentityManager";

class FactoryIdentity {
    private optionsEncryptionLayer: IOption[]
    private optionsKeysGenerator: IOption[]

    constructor() {
        this.optionsEncryptionLayer = [
            { name: "aes", option: EncryptioLayerAES },
            { name: "pgp", option: EncryptionLayerPGP },
        ]
        this.optionsKeysGenerator = [
            { name: "pgp", option: KeysGeneratorPGP }
        ]

    }
    setOptionEncryption(option: IOption) {
        const optionEncryptionExist = this.optionsEncryptionLayer.find(optionAux => optionAux.name === option.name);
        if (optionEncryptionExist) {
            throw new Error("This option already exists.");
        }
        this.optionsEncryptionLayer.push(option);
    }
    setOptionKeysGenerator(option: IOption) {
        const optionKeysGenerator = this.optionsKeysGenerator.find(optionAux => optionAux.name === option.name);
        if (optionKeysGenerator) {
            throw new Error("This option already exists.");
        }
        this.optionsKeysGenerator.push(option);
    }

    generateIdentity(encryptionLayerType: string, generatorKeysType: string): IdentityManager {
        const encryptionLayer = this.optionsEncryptionLayer.find(option => option.name.toLowerCase() === encryptionLayerType.toLowerCase());
        const keysGenerator = this.optionsKeysGenerator.find(option => option.name.toLowerCase() === generatorKeysType.toLowerCase());

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