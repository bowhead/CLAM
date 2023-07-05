"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class NotFoundError extends Error {
    constructor() {
        super(...arguments);
        this.httpStatus = 404;
    }
}
exports.default = NotFoundError;
//# sourceMappingURL=NotFoundError.js.map