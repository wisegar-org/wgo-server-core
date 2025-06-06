import { Request, Response } from "express";
import { Controller } from "../../decorators/controller.decorator";
import { Get } from "../../decorators/get.decorator";
import { OvhService } from "../services/ovh.service";
import { validateOvhAuthHeader } from "../../services/ovh-auth.service";

@Controller("/api/ovh")
export class OvhController {
  @Get("/me")
  public async GetOvhMe(req: Request, res: Response) {
    const validRequest = validateOvhAuthHeader(req);
    if (!validRequest) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const ovhService = new OvhService();
    const result = await ovhService.getOvhMe();
    return res.status(200).json(result);
  }
  @Get("/domain")
  public async GetOvhDomain(req: Request, res: Response) {
    const validRequest = validateOvhAuthHeader(req);
    if (!validRequest) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const ovhService = new OvhService();
    const result = await ovhService.getOvhDomain();
    return res.status(200).json(result);
  }
}
