import { IsStringEmptyNullOrUndefined } from "wgo-extensions";

/**
 * Controller Decorator
 * @param prefix ""
 * @returns
 */
export const Controller = (prefix: string = ""): ClassDecorator => {
  return (target: any) => {
    Reflect.defineMetadata("prefix", prefix, target);

    // Since routes are set by our methods this should almost never be true (except the controller has no methods)
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
};

/**
 * Api Controller Decorator
 * @param prefix "/api/*"
 * @returns
 */
export const ApiController = (prefix: string = ""): ClassDecorator => {
  return (target: any) => {
    let apiPrefix = "/api";
    if (IsStringEmptyNullOrUndefined(prefix)) {
      apiPrefix = `/api/${target.name.toLowerCase()}`;
    } else if (!prefix.startsWith("/")) {
      apiPrefix = `/api/${prefix}`;
    } else {
      apiPrefix = `/api${prefix}`;
    }

    Reflect.defineMetadata("prefix", apiPrefix, target);
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
};
/**
 * Manage Controller Decorator
 * @param prefix "/manage/*"
 * @returns
 */
export const ManageController = (prefix: string = ""): ClassDecorator => {
  return (target: any) => {
    const managePrefix = IsStringEmptyNullOrUndefined(prefix)
      ? "/manage"
      : `/manage/${prefix}`;
    Reflect.defineMetadata("prefix", managePrefix, target);
    if (!Reflect.hasMetadata("routes", target)) {
      Reflect.defineMetadata("routes", [], target);
    }
  };
};
