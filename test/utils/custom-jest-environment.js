/**
 * @jest-environment node
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const NodeEnvironment = require('jest-environment-node');

/**
 * Custom environment for Jest test cases
 */
class CustomEnvironment extends NodeEnvironment {

    /**
     * 
     * @param {Object} config - Node environment config
     */
    constructor(config) {
        super(
            Object.assign({}, config, {
                globals: Object.assign({}, config.globals, {
                    Uint32Array: Uint32Array,
                    Uint8Array: Uint8Array,
                    ArrayBuffer: ArrayBuffer,
                }),
            }),
        );
    }

    /**
     * 
     */
    async setup() {
        await super.setup();
    }

    /**
     * 
     */
    async teardown() {
        await super.teardown();
    }

}

// eslint-disable-next-line no-undef
module.exports = CustomEnvironment;