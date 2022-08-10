/**
 * @jest-environment node
 */
const NodeEnvironment = require("jest-environment-node");

class CustomEnvironment extends NodeEnvironment {
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

  async setup() {
    await super.setup();
  }

  async teardown() {
    await super.teardown();
  }

}

module.exports = CustomEnvironment;