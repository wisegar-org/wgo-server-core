import "reflect-metadata";

export interface PermissionOptions {
  user: { [key: string]: boolean };
  owner: { [key: string]: boolean };
}

export const Permission = (permission: string): MethodDecorator => {
  console.log("Permission decorator, permission: ", permission);
  return (
    target,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void => {
    console.log("Permission decorator, target ctr: ", target.constructor);
    console.log("Permission decorator, target ctx: ", (target as any).ctx);
    Reflect.defineMetadata("permissions", permission, target);
    console.log("Permission decorator, propertyKey: ", propertyKey);
    console.log("Permission decorator, descriptor: ", descriptor);
  };
};
