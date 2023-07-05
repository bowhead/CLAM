"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class InternalServerError extends Error {
    constructor() {
        super(...arguments);
        this.httpStatus = 500;
    }
}
exports.default = InternalServerError;
//# sourceMappingURL=InternalServerError.js.map