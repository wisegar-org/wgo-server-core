import express, { Express } from "express";
import { engine } from "express-handlebars";
import path from "path";
import { GetWebRootKey } from "./HostAdminMiddleware";

export const GetHandlebarStaticsKey = () => {
  const app_web_root = GetWebRootKey();
  return path.join(app_web_root, "public");
};
export const GetHandlebarRootKey = () => {
  const app_web_root = GetWebRootKey();
  return path.join(app_web_root, "views");
};

export const UseTemplatingMiddleware = (app: Express) => {
  app.engine(
    "handlebars",
    engine({
      extname: ".handlebars",
      helpers: require("../helpers/HandlebarsHelpers"),
    })
  );
  app.set("view engine", ".handlebars");

  //app.engine("handlebars", engine());
  //app.set("view engine", "handlebars");
  //const viewPath = GetHandlebarRootKey();
  //app.set("views", viewPath);
  //app.use("/", express.static(GetHandlebarStaticsKey()));

  /**Using module */
  app.set("views", path.join(GetWebRootKey(), "modules", "views"));
  app.use("/", express.static(path.join(GetWebRootKey(), "modules", "public")));

  const elements = [
    {
      name: "Leche",
      age: 2,
    },
    {
      name: "Pan",
      age: 4,
    },
  ];
  app.get("/template", (req, res) => {
    res.render("home", {
      title: "Express running",
      admin: true,
      elements: elements,
    });
  });
};
