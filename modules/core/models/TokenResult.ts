import { IUser } from "../../interfaces/user.interface";

export class TokenResult {
  username?: string;
  token?: string;
  isExpiring: boolean;
  error?: string;
  session?: string;

  constructor() {
    this.isExpiring = false;
  }
  /**
   * @method SetError Set and error message and return the result
   */
  public SetError(error: string): TokenResult {
    this.error = error;
    return this;
  }
  /**
   * @method SetUser Set user information and return the object
   */
  public SetUser(user: IUser, token?: string): TokenResult {
    this.username = user.username;
    if (token) this.token = token;
    return this;
  }
}
