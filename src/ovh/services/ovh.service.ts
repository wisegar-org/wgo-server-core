export class OvhService {
  private ovh: any;
  private appKey: string = "49efe3b885fb556a";
  private appSecret: string = "3a7c0846b0747a197ec223bc2f7d72bd";
  private consumerKey: string = "b77add1af57497dca3436ec94d7e75a5";

  constructor() {
    // Initialize the OVH service here if needed
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
