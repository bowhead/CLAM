"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class BadRequestError extends Error {
    constructor() {
        super(...arguments);
        this.httpStatus = 400;
    }
}
exports.default = BadRequestError;
//# sourceMappingURL=BadRequestError.js.map