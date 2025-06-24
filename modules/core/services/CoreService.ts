import { normalize, join } from "path";
import { readJsonSync, existsSync, writeJsonSync } from "fs-extra";
import { IContextBase } from "@wisegar-org/wgo-base-models";

export class CoreService {
  webRoot: string;
  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.webRoot = ctx.web_root;
  }
  public getApiVersion() {
    let path = __filename.split("src\\services");
    if (path.length === 0) {
      path = __filename.split("services");
    }
    const packagePath = normalize(join(this.webRoot, "package.json"));
    if (existsSync(packagePath)) {
      const packageJson = readJsonSync(packagePath);
      return packageJson.version;
    }
    return process.env.API_VERSION || "unknown version";
  }

  public getLocalStorage(id: string) {
    const lsPath = normalize(join(this.webRoot, "localStorage.json"));
    if (existsSync(lsPath)) {
      const packageJson = readJsonSync(lsPath);
      return JSON.stringify(id in packageJson ? packageJson[id] : {});
    }
    return JSON.stringify({});
  }

  public setKeyLocalStorage(id: string, key: string, value: string) {
    const lsPath = normalize(join(this.webRoot, "localStorage.json"));
    const lsJSON = !!existsSync(lsPath) ? readJsonSync(lsPath) : {};
    if (!(id in lsJSON)) lsJSON[id] = {};
    lsJSON[id][key] = value;
    writeJsonSync(lsPath, lsJSON);
    return true;
  }

  public cleanLocalStorage(id: string) {
    const lsPath = normalize(join(this.webRoot, "localStorage.json"));
    const lsJSON = !!existsSync(lsPath) ? readJsonSync(lsPath) : {};
    lsJSON[id] = {};
    writeJsonSync(lsPath, lsJSON);
    return true;
  }
}
