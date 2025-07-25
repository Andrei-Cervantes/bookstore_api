const successResponse = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    message,
    data,
  });
};

const errorResponse = (res, statusCode, message, errors) => {
  return res.status(statusCode).json({
    message,
    errors,
  });
};

export { successResponse, errorResponse };
