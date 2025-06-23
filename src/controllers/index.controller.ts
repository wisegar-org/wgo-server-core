import { Request, Response } from "express";
import { Controller } from "../decorators/controller.decorator";
import { Get } from "../decorators/get.decorator";

@Controller("/")
export class OvhController {
  @Get("/")
  public async GetOvhMe(req: Request, res: Response) {
    try {
      //return res.status(200).json(result);
    } catch (e) {
      console.error("Error in GetOvhMe:", e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
