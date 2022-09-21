import NonceManager from "../src/contractIntegration/interaction/web3Provider/nonceManager/NonceManager";
describe('Testing NonceManager component using cache implementation', () => {
    let nonceManager: NonceManager;
    beforeEach(() => {
        nonceManager = new NonceManager("memory", 0);
    })

    test('should nonce be equal 0', () => {
        const nonce = nonceManager.get();
        expect(nonce).toBe(0);
    });
    test('should nonce increce 3', () => {
        nonceManager.save(nonceManager.get() + 1);
        nonceManager.save(nonceManager.get() + 1);
        nonceManager.save(nonceManager.get() + 1);
        const nonce = nonceManager.get();
        expect(nonce).toBe(3);
    });
    test('should nonceManager be created with a nonce equal 10', () => {
        const myNonce: NonceManager = new NonceManager("memory", 10);
        expect(myNonce.get()).toBe(10);
    });

});