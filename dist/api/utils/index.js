"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.formatResponse = void 0;
const formatResponse = (data, message = 'Success') => {
    return {
        status: 'success',
        message,
        data,
    };
};
exports.formatResponse = formatResponse;
const handleError = (error) => {
    return {
        status: 'error',
        message: error.message || 'An error occurred',
    };
};
exports.handleError = handleError;
