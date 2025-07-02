import { Request, Response } from "express";
import { Controller } from "../../core/decorators/controller.decorator";
import { Get } from "../../core/decorators/get.decorator";

@Controller("/api")
export class AppController {
  @Get("/version")
  public GetVersion(req: Request, res: Response) {
    res.status(200).json("{version: 'v0.0.1'}");
  }
}
