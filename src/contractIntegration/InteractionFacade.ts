class InteractionFacade{
    private static instance: InteractionFacade;

    private constructor(){}

    public static getInstance (){
        if(!InteractionFacade.instance){
            InteractionFacade.instance = new InteractionFacade();
        }
        return this.instance;
    }

    

}

export default InteractionFacade;