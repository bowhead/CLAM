"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
class ForbiddenError extends Error {
    constructor() {
        super(...arguments);
        this.httpStatus = 403;
    }
}
exports.default = ForbiddenError;
//# sourceMappingURL=ForbiddenError.js.map