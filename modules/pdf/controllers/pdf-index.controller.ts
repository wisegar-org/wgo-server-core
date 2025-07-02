import { Request, Response } from "express";
import { Controller } from "../../core/decorators/controller.decorator";
import { Get } from "../../core/decorators/get.decorator";

@Controller("/pdf-tools")
export class PdfIndexController {
  @Get("/")
  public async Get(req: Request, res: Response) {
    try {
      res.render("pdf-index");
    } catch (e) {
      console.error("Error", e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
