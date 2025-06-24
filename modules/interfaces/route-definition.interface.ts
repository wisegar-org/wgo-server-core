export interface IRouteAuthPermission {
  authorize?: boolean;
  roles?: string[];
}
export interface RouteDefinition {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: "get" | "post" | "delete" | "options" | "put";
  // Method name within our class responsible for this route
  methodName: string;
  // Controller
  controller: string;
  // Form
  formParams?: unknown | undefined;
  // Body
  formBody?: unknown | undefined;
  // Response
  response?: unknown | undefined;
  // Authorization Data
  authorization?: IRouteAuthPermission | undefined;
}
