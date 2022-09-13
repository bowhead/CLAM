/**
 * 
 */
class ForbiddenError extends Error {
    readonly httpStatus = 403;
}

export default ForbiddenError;