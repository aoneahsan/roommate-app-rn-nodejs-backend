module.exports = {
  // Auth Related Error Responses
  UNAUTHENTICATED: {
    message: "UNAUTHENTICATED",
    statusCode: 403,
  },

  // invalid input
  INVALID_INPUT: {
    message: "INVALID_INPUT",
    statusCode: 422,
  },

  // graphql default error response
  GRAPHQL_DEFAULT_ERROR_RESPONSE: {
    message: "GRAPHQL_DEFAULT_ERROR_RESPONSE",
    statusCode: 500,
  },

  // action success response
  SUCCESS: {
    message: "SUCCESS",
    statusCode: 200,
  },

  // item created response
  CREATED: {
    message: "CREATED",
    statusCode: 201,
  },

  // item updated response
  UPDATED: {
    message: "UPDATED",
    statusCode: 200,
  },

  // item deleted response
  DELETED: {
    message: "DELETED",
    statusCode: 200,
  },

  // global error handler middleware(GEHM) (in app.js), default error response
  GEHM_DEFAULT_RESPONSE: {
    message: "GEHM_DEFAULT_RESPONSE",
    statusCode: 500,
    errors: [],
  },

  USER_EXISTS: {
    message: "USER_EXISTS",
    statusCode: 400,
    errors: [],
  },
};
