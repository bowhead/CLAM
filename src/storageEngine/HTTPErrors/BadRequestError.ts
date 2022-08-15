/**
 * 
 */
class BadRequestError extends Error {
    readonly httpStatus = 400;
}

export default BadRequestError;