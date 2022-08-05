import "reflect-metadata"
import { container } from "tsyringe";
import {
    ConsentInteractionCLAM,
    AccessInteractionCLAM,
    Interaction,
    IOption
} from "../";

class FactoryInteraction {
    public optionsConsentInteraction: IOption[];
    public optionsAccessInteraction: IOption[];
    public constructor() {
        this.optionsConsentInteraction = [{ name: "clam", option: ConsentInteractionCLAM }]
        this.optionsAccessInteraction = [{ name: "clam", option: AccessInteractionCLAM }]
    }
    public setOptionConsentInteraction(option: IOption): void {
        if(option.name.trim()==="" && option.name.trim().length===0){
            throw new Error("The name must have at least one character");
        }
        const optionConsentExist = this.optionsConsentInteraction.find(optionAux => optionAux.name === option.name);
        if (optionConsentExist) {
            throw new Error("This option already exists.");
        }
        this.optionsConsentInteraction.push(option);
    }
    public setOptionAccessInteraction(option: IOption): void {
        if(option.name.trim()==="" && option.name.trim().length===0){
            throw new Error("The name must have at least one character");
        }
        const optionAccessExist = this.optionsAccessInteraction.find(optionAux => optionAux.name === option.name);
        if (optionAccessExist) {
            throw new Error("This option already exists.");
        }
        this.optionsAccessInteraction.push(option);
    }
    public generateInteraction(consentType: string, accessType: string): Interaction {
        if(consentType.trim()==="" && consentType.trim().length===0){
            throw new Error("The consent implementation name must have a minimum of one character");
        }
        if(accessType.trim()==="" && accessType.trim().length===0){
            throw new Error("The access implementation name must have a minimum of one character");
        }
        const consent = this.optionsConsentInteraction.find(option => option.name.toLowerCase() === consentType.toLowerCase());
        const access = this.optionsAccessInteraction.find(option => option.name.toLowerCase() === accessType.toLowerCase());

        if (!consent) {
            throw new Error("The consentInteraction type doesn't exist");
        }
        if (!access) {
            throw new Error("The accessInteraction type doesn't exist");
        }
        container.register("ConsentInteraction", consent.option);
        container.register("AccessInteraction", access.option);

        const interaction: Interaction = container.resolve(Interaction);

        return interaction;
    }
}


export default FactoryInteraction;