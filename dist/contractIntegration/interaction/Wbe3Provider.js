/**
 * This class is used to contain the information and configuration
 * to perform interaction with web 3 and contracts.
 */
var Web3Provider = /** @class */ (function () {
    /**
     * Empty constructor
     */
    function Web3Provider() {
    }
    /**
     * This function returns the instance of the class using the sigleton pattern.
     *
     * @returns {Web3Provider} return a instance of Web3Provider.
     */
    Web3Provider.getInstance = function () {
        if (!Web3Provider.instance) {
            Web3Provider.instance = new Web3Provider();
        }
        return this.instance;
    };
    /**
     * This function set the configuration to connect with the blockchain.
     *
     * @param {Web3} web3Object This parameter this parameter Web3Provider.
     */
    Web3Provider.prototype.setConfig = function (web3Object, interactionConfig) {
        this.web3Object = web3Object;
        this.interactionConfig = interactionConfig;
    };
    /**
     * This function return a new Web3 instance.
     *
     * @returns {Web3} returna instance of Web3 using the configuration.
     */
    Web3Provider.prototype.getProvider = function () {
        return this.web3Object;
    };
    return Web3Provider;
}());
export default Web3Provider;
//# sourceMappingURL=Wbe3Provider.js.map