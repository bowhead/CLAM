import Web3 from "web3"

let web3 : Web3;

/**
 * Generate a new Web3 object if it was not created already.
 * @returns {Web3} - Web3 instance
 */
function getInstance () {
    if(!web3) {
        web3 = new Web3('http://127.0.0.1:8545/');
    }

    return web3;
}

export { getInstance };