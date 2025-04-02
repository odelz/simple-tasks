export const formatResponse = (data: any, message: string = 'Success') => {
    return {
        status: 'success',
        message,
        data,
    };
};

export const handleError = (error: any) => {
    return {
        status: 'error',
        message: error.message || 'An error occurred',
    };
};