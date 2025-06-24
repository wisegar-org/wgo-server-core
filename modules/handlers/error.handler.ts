export const errorHandler = (err: any): any => {
  return {
    message: err.message,
    code:
      err.originalError && err.originalError.code
        ? err.originalError.code
        : 500,
    locations: err.locations,
    path: err.path,
    original: err.originalError,
  };
};
