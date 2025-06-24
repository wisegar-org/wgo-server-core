import { IsStringEmptyNullOrUndefined } from "wgo-extensions";

//TODO: Ovh Api for nodejs
export class OvhService {
  private ovh: any;
  private appKey: string;
  private appSecret: string;
  private consumerKey: string;

  constructor() {
    this.appKey = process.env.OVH_APP_KEY || "";
    this.appSecret = process.env.OVH_APP_SECRET || "";
    this.consumerKey = process.env.OVH_CONSUMER_KEY || "";

    if (
      IsStringEmptyNullOrUndefined(this.appKey) ||
      IsStringEmptyNullOrUndefined(this.appSecret) ||
      IsStringEmptyNullOrUndefined(this.consumerKey)
    ) {
      throw new Error("OVH credentials are not set in environment variables.");
    }
  }

  private initializeOvh() {
    if (!this.ovh) {
      return (this.ovh = require("ovh")({
        appKey: this.appKey,
        appSecret: this.appSecret,
        consumerKey: this.consumerKey,
      }));
    }
    return this.ovh;
  }
  public async getOvhMe(): Promise<any> {
    const ovh = this.initializeOvh();
    try {
      const response = await ovh.requestPromised("GET", "/me");
      return response;
    } catch (err) {
      console.error("Error fetching /me:", err);
      throw err;
    }
  }
  public async getOvhDomain(): Promise<any> {
    const ovh = this.initializeOvh();
    try {
      const response = await ovh.requestPromised("GET", "/domain");
      return response;
    } catch (err) {
      console.error("Error fetching /domain:", err);
      throw err;
    }
  }
}
