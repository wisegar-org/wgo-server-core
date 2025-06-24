import express from "express"; // Importar express
import { engine } from "express-handlebars";
import { join } from "path";
import { GetWebRootKey } from "./HostClientMiddleware";

export const UseHandlebarsRenderMiddleware = (app: any) => {
  app.engine(
    ".hbs",
    engine({
      extname: ".hbs",
      helpers: require("./handlebarsHelpers"),
      defaultLayout: "main",
      partialsDir: join(GetWebRootKey(), "handlebars", "partials"),
      layoutsDir: join(GetWebRootKey(), "handlebars", "layouts"),
    })
  );
  app.set("view engine", ".hbs");
  app.set("views", [
    join(GetWebRootKey(), "handlebars", "views"),
    join(GetWebRootKey(), "modules", "ovh", "views"),
  ]);
  // Set the 'handlebars' folder to static to serve files like images, CSS, etc..
  app.use(express.static(join(GetWebRootKey(), "handlebars")));
};
