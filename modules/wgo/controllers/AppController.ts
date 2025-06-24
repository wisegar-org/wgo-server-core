import { Request, Response } from "express";
import { Controller } from "../../decorators/controller.decorator";
import { Get } from "../../decorators/get.decorator";

@Controller("/api")
export class AppController {
  @Get("/version")
  public GetVersion(req: Request, res: Response) {
    res.status(200).json("{version: 'v0.0.1'}");
  }
}
