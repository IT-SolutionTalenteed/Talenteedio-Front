import { HttpStatusCode } from '../constants/http-status-codes.constant';

interface FieldError {
    errorName: string;
    description: string;
}

export class HttpException extends Error {
    status: HttpStatusCode;
    override message: string;
    fieldErrorMap: Record<string, FieldError>;
    constructor(status: HttpStatusCode, message: string, fieldErrorMap: Record<string, FieldError> = {}) {
        super(message);
        this.status = status;
        this.message = message;
        this.fieldErrorMap = fieldErrorMap;
    }
}
