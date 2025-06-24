import { RouteDefinition } from "../../interfaces/route-definition.interface";

export class ExportData {
  static instance: ExportData;
  routes: RouteDefinition[];

  errorResponse: (errors: unknown) => unknown;

  defaultErrorResponse(errors: unknown): unknown {
    return { ok: false, data: errors, error: "form.wrong.data" };
  }

  constructor() {
    this.routes = [];
    this.errorResponse = this.defaultErrorResponse;
  }

  setResponseErrorTransform(transformFn: Function): boolean {
    if (typeof transformFn == "function") {
      this.errorResponse = transformFn as (errors: unknown) => unknown;
      return true;
    }
    return false;
  }

  static getInstance(): ExportData {
    if (!this.instance) {
      this.instance = new ExportData();
    }
    return this.instance;
  }
}
