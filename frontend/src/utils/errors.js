export function normalizeError(error) {
  if (!error) {
    return 'Something went wrong';
  }

  if (typeof error === 'string') {
    return error;
  }

  const responseData = error.response?.data;

  if (responseData) {
    if (typeof responseData === 'string') {
      return responseData;
    }

    if (typeof responseData.error === 'string') {
      return responseData.error;
    }

    if (typeof responseData.error === 'object' && responseData.error?.error) {
      return String(responseData.error.error);
    }

    if (typeof responseData.message === 'string') {
      return responseData.message;
    }
  }

  if (error.message) {
    return error.message;
  }

  return 'Something went wrong';
}
