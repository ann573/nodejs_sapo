export const successResponse = (res, statusCode, data, message = 'Success') => {
    return res.status(statusCode).json({
      success: true,
      message: message,
      data: data
    });
  };
  
  export const errorResponse = (res, statusCode, message = 'Failed') => {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  };
  