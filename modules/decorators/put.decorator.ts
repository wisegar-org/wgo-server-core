import "reflect-metadata";
import {
  IRouteAuthPermission,
  RouteDefinition,
} from "../interfaces/route-definition.interface";
import { FormConstructor, ResponseConstructor } from "./export.decorator";
/**
 * Use to set this method as a put rest call. Authorize is true by default
 * @param path
 * @param authorization
 * @param formParams
 * @param formBody
 * @param response
 * @returns
 */
export const Put = (
  path: string,
  authorization?: IRouteAuthPermission,
  formParams?: FormConstructor,
  formBody?: FormConstructor,
  response?: ResponseConstructor
): MethodDecorator => {
  return (target, propertyKey: string | symbol): void => {
    // In case this is the first route to be registered the `routes` metadata is likely to be undefined at this point.
    // To prevent any further validation simply set it to an empty array here.
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    // Get the routes stored so far, extend it by the new route and re-set the metadata.
    const routes = Reflect.getMetadata(
      "routes",
      target.constructor
    ) as Array<RouteDefinition>;

    routes.push({
      requestMethod: "put",
      path,
      methodName: propertyKey as string,
      controller: target.constructor.name,
      formParams: formParams ? new formParams() : null,
      formBody: formBody ? new formBody() : null,
      response: response ? new response() : null,
      authorization: authorization ? authorization : { authorize: true },
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
