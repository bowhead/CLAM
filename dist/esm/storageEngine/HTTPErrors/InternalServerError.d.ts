/**
 *
 */
declare class InternalServerError extends Error {
    readonly httpStatus = 500;
}
export default InternalServerError;
