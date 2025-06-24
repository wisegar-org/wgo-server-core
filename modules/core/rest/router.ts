import { RouteDefinition } from "../../interfaces/route-definition.interface";
import { ExportData } from "./dataExport";
import { parseForms } from "./parser";
import { Request, Response } from "express";

export const configRouter = (controllers: any[], app: any) => {
  controllers.forEach((controller) => {
    const exports = ExportData.getInstance();
    const instance = new controller();
    const prefix = Reflect.getMetadata("prefix", controller);
    const routes: Array<RouteDefinition> = Reflect.getMetadata(
      "routes",
      controller
    );

    exports.routes = exports.routes.concat(routes);

    routes.forEach((route) => {
      switch (route.requestMethod) {
        case "get":
          app.get(prefix + route.path, async (req: Request, res: Response) => {
            await parseForms(instance, route, req, res);
          });
          break;

        case "post":
          app.post(prefix + route.path, async (req: Request, res: Response) => {
            await parseForms(instance, route, req, res);
          });
          break;

        case "put":
          app.put(prefix + route.path, async (req: Request, res: Response) => {
            await parseForms(instance, route, req, res);
          });
          break;

        case "delete":
          app.delete(
            prefix + route.path,
            async (req: Request, res: Response) => {
              await parseForms(instance, route, req, res);
            }
          );
          break;
      }
    });
  });
};
