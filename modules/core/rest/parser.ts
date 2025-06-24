import {
  ExportableForm,
  SimpleValidationError,
} from "../../decorators/export.decorator";
import { RouteDefinition } from "../../interfaces/route-definition.interface";
import { ExportData } from "./dataExport";
import { Request, Response } from "express";

export const parseForms = async (
  instance: any,
  route: RouteDefinition,
  req: Request,
  res: Response
): Promise<void> => {
  const exports = ExportData.getInstance();
  let paramsErrors: SimpleValidationError[] = [];
  if (route.formParams) {
    paramsErrors = await (route.formParams as ExportableForm).parseBody(
      req.params
    );
  }
  let bodyErrors: SimpleValidationError[] = [];
  if (route.formBody) {
    bodyErrors = await (route.formBody as ExportableForm).parseBody(req.body);
  }
  if (paramsErrors.length > 0 || bodyErrors.length > 0) {
    res.json(exports.errorResponse(paramsErrors.concat(bodyErrors)));
    return;
  }
  instance[route.methodName](req, res, route.formParams, route.formBody);
  return;
};
