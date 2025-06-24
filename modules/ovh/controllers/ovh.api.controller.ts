import { Request, Response } from "express";
import {
  ApiController,
  Controller,
} from "../../decorators/controller.decorator";
import { Get } from "../../decorators/get.decorator";
import { validateOvhAuthHeader } from "../../services/ovh-auth.service";
import { OvhService } from "../services/ovh.service";

@ApiController("ovh")
export class OvhController {
  @Get("/me")
  public async GetOvhMe(req: Request, res: Response) {
    try {
      const validRequest = validateOvhAuthHeader(req);
      if (!validRequest) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const ovhService = new OvhService();
      const result = await ovhService.getOvhMe();
      return res.status(200).json(result);
    } catch (e) {
      console.error("Error in GetOvhMe:", e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  @Get("/domain")
  public async GetOvhDomain(req: Request, res: Response) {
    try {
      const validRequest = validateOvhAuthHeader(req);
      if (!validRequest) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const ovhService = new OvhService();
      const result = await ovhService.getOvhDomain();
      return res.status(200).json(result);
    } catch (e) {
      console.error("Error in GetOvhDomain:", e);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
