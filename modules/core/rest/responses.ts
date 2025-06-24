import { IResponse } from "../models/responses/Response";

export const HttpResponse = {
  GetBadRequestResponse: (data: unknown = null) => {
    const response: IResponse = {
      ok: false,
      statusCode: 400,
      data: data ? data : null,
      isSuccess: false,
      result: undefined,
      message: null,
      error: null,
    };
    return response;
  },
  GetServerErrorResponse: (data: unknown = null) => {
    const response: IResponse = {
      ok: false,
      statusCode: 500,
      data: data ? data : null,
      isSuccess: false,
      result: undefined,
      message: null,
      error: null,
    };
    return response;
  },
  GetOkResponse: (data: unknown = null) => {
    const response: IResponse = {
      ok: true,
      statusCode: 200,
      data: data ? data : null,
      isSuccess: false,
      result: undefined,
      message: null,
      error: null,
    };
    return response;
  },
};

export const JsonResponse = (
  status: boolean,
  statusCode: number = 200,
  data: unknown
) => {
  const response: IResponse = {
    ok: status,
    statusCode: statusCode,
    data: data,
    isSuccess: false,
    result: undefined,
    message: null,
    error: null,
  };
  return response;
};
