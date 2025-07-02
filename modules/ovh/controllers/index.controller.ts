import { Request, Response } from "express";
import { Controller } from "../../core/decorators/controller.decorator";
import { Get } from "../../core/decorators/get.decorator";

@Controller("/ovh")
export class IndexOvhController {
  @Get("/")
  public async GetOvhMe(req: Request, res: Response) {
    try {
      res.render("index");
    } catch (e) {
      console.error("Error in GetOvhMe:", e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
