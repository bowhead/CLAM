/**
 * 
 */
class NotFoundError extends Error {
    readonly httpStatus = 404;
}

export default NotFoundError;