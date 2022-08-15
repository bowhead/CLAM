/**
 * 
 */
class ForbidenError extends Error {
    readonly httpStatus = 403;
}

export default ForbidenError;