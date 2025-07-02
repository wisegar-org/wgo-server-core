import { IUserRole } from "./user-role.interface";

export interface IUser {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password?: string;
  roles?: IUserRole[];
}
