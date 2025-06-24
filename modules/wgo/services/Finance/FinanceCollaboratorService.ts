import { Repository } from "typeorm";
import CollaboratorEntity from "../../database/entities/Finance/CollaboratorEntity";
import { USER_ROLE } from "../../models/constants";
import { IAuthRegisterParams, SUPERADMIN } from "@wisegar-org/wgo-base-models";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import { RoleEntity } from "../../../database/entities/RoleEntity";
import { UserRolesService } from "../../../services/users-roles.service";
import { AuthenticationService } from "../../../services/authentication.service";

export class FinanceCollaboratorService {
  private ctx: IContextBase;
  private repo: Repository<CollaboratorEntity>;
  private rolesRepository: Repository<RoleEntity>;
  private userRolesModel: UserRolesService;
  private authModel: AuthenticationService;
  constructor(ctx: IContextBase) {
    // debugger
    this.ctx = ctx;
    this.repo = this.ctx.dataSource.getRepository(CollaboratorEntity);
    this.rolesRepository = this.ctx.dataSource.getRepository(RoleEntity);
    this.authModel = new AuthenticationService({ ctx: ctx } as any);
    this.userRolesModel = new UserRolesService({ ctx: ctx } as any);
  }

  async addCollaborator(
    numberId: number,
    login: string,
    node_id: string,
    type: string,
    avatar_url: string,
    url: string,
    name: string,
    location: string,
    email: string,
    bio: string,
    isCollaborator = false,
    card_number: string,
    address: string,
    cap: string,
    place: string
  ): Promise<CollaboratorEntity | null> {
    const result = await this.repo.findOne({
      where: [
        {
          id: numberId,
        },
        {
          login: login,
        },
      ],
    });

    if (isCollaborator) {
      await this.createUser(name, login, email);
    }

    if (result !== null) {
      return null;
    }

    const proj = new CollaboratorEntity(
      numberId,
      login,
      node_id,
      type,
      avatar_url,
      url,
      name,
      location,
      email,
      bio,
      card_number,
      0,
      address,
      cap,
      place
    );
    proj.login = isCollaborator ? proj.login : name;
    proj.isCollaborator = isCollaborator;
    return await this.repo.manager.save(proj);
  }

  async updateCollaborator(
    id: number,
    login: string,
    node_id: string,
    type: string,
    avatar_url: string,
    url: string,
    name: string,
    location: string,
    email: string,
    bio: string,
    isCollaborator = false
  ) {
    let collaborator = await this.repo.findOne({
      where: {
        id: id,
      },
    });

    if (collaborator !== null) {
      collaborator.login = login || collaborator.login;
      collaborator.node_id = node_id || collaborator.node_id;
      collaborator.type = type || collaborator.type;
      collaborator.avatar_url = avatar_url || collaborator.avatar_url;
      collaborator.url = url || collaborator.url;
      collaborator.name = collaborator.name ? collaborator.name : name;
      collaborator.location = location || collaborator.location;
      collaborator.email = collaborator.email ? collaborator.email : email;
      collaborator.bio = bio || collaborator.bio;
      collaborator.isCollaborator = isCollaborator;
      collaborator.login = isCollaborator ? collaborator.login : name;
      return await collaborator.save();
    }

    return null;
  }

  async updateOrInsertCollaborator(
    numberId: number,
    login: string,
    node_id: string,
    type: string,
    avatar_url: string,
    url: string,
    name: string,
    location: string,
    email: string,
    bio: string,
    isCollaborator = false
  ): Promise<CollaboratorEntity> {
    const findCollaborator = await this.repo.findOne({
      where: {
        id_github: numberId,
      },
    });
    let collaborator = await this.updateCollaborator(
      findCollaborator ? findCollaborator.id : 0,
      login,
      node_id,
      type,
      avatar_url,
      url,
      name,
      location,
      email,
      bio,
      isCollaborator
    );

    if (collaborator ? collaborator.isCollaborator : isCollaborator) {
      await this.createUser(name, login, email);
    }

    if (!collaborator) {
      collaborator = new CollaboratorEntity(
        numberId,
        login,
        node_id,
        type,
        avatar_url,
        url,
        name,
        location,
        email,
        bio
      );
      collaborator.isCollaborator = isCollaborator;
      return await this.repo.manager.save(collaborator);
    }

    return collaborator;
  }

  async findCollaboratorById(
    numberId: number
  ): Promise<CollaboratorEntity | null> {
    return await this.repo.findOne({
      where: {
        id: numberId,
      },
    });
  }

  async findCollaboratorByOptions(
    options: any
  ): Promise<CollaboratorEntity | null> {
    return await this.repo.findOne(options);
  }

  async getAllCollaborators(): Promise<any[]> {
    const filter = await this.getFilterByCollaborator("id");
    const collaborators = await this.repo.find({
      where: {
        ...filter,
      },
      order: {
        name: "ASC",
      },
    });

    return collaborators.map((item) => ({
      id: item.id,
      id_github: item.id_github,
      card_number: item.card_number || 0,
      pay_by_hours: item.pay_by_hours || 0,
      login: item.login || "",
      node_id: item.node_id || "",
      type: item.type || "",
      avatar_url: item.avatar_url || "",
      url: item.url || "",
      name: item.name || "",
      location: item.location || "",
      email: item.email || "",
      bio: item.bio || "",
      address: item.address || "",
      cap: item.cap || "",
      place: item.place || "",
    }));
  }

  async updateAccountingInfo(
    numberId: number,
    name: string,
    card_number: string,
    pay_by_hours: number,
    email: string,
    address: string,
    cap: string,
    place: string,
    bio: string,
    type: string
  ): Promise<CollaboratorEntity | null> {
    const filter = await this.getFilterByCollaborator("id");
    let collaborator = await this.repo.findOne({
      where: {
        id: numberId,
        ...filter,
      },
    });
    if (collaborator !== null) {
      collaborator.name = name;
      collaborator.login = !collaborator.isCollaborator
        ? name
        : collaborator.login;
      collaborator.card_number = card_number;
      collaborator.pay_by_hours = pay_by_hours;
      collaborator.email = email;
      collaborator.address = address;
      collaborator.cap = cap;
      collaborator.place = place;
      collaborator.bio = !collaborator.isCollaborator ? bio : collaborator.bio;
      collaborator.type = !!type ? type : collaborator.type;

      const user = await this.userRolesModel.getEntityByCriteria({
        userName: collaborator.login,
      });
      if (user) {
        user.name = !user.name ? name : user.name;
        user.email = email ? email : user.email;
        user.password = "";

        await this.authModel.editUser(user as any);
      }

      return await collaborator.save();
    }
    return null;
  }

  private async createUser(name: string, userName: string, email: string) {
    let userResponse = await this.userRolesModel.getEntityByCriteria({
      userName: userName,
    });

    if (!userResponse) {
      const splitName = name.split(" ");
      const user_name = splitName.splice(0, 1)[0];
      const user_lastName = splitName.length > 0 ? splitName.join(" ") : "";
      const user_email = email !== "" && email.indexOf("@") !== -1 ? email : "";

      const authModelParam: IAuthRegisterParams = {
        email: user_email,
        isEmailConfirmed: false,
        roles: [USER_ROLE],
        name: user_name,
        userName: userName,
        lastName: user_lastName,
        code: "",
        certificate: "",
        id: 0,
        password: "",
        cap: "",
        phone: "",
        address: "",
      };
      const userResult = await this.authModel.register(authModelParam);

      if (userResult) {
        console.log("Create user by collaborator: ", userResult.userName);
      }
    } else if (!email && userResponse) {
      const splitName = name.split(" ");
      const user_name = splitName.splice(0, 1)[0];
      const user_lastName = splitName.join(" ");

      const user = userResponse;

      if (!user.email) {
        user.email = email;
      }

      if (!user.name) {
        user.name = user_name;
      }

      if (!user.lastName) {
        user.lastName = user_lastName;
      }
      user.password = "";

      await this.authModel.editUser(user as any);
    }
  }

  getUserDataService(): UserRolesService {
    return this.userRolesModel;
  }

  async getFilterByCollaborator(property: string) {
    let filter = {};
    if (!this.ctx || !this.ctx.user) {
      filter = { [property]: null };
    } else if (
      this.ctx.user &&
      this.ctx.user.roles.filter((rol) => rol === SUPERADMIN).length === 0
    ) {
      const user = await this.userRolesModel.getEntityByCriteria({
        id: this.ctx.user.id,
      });
      const coll =
        user && user.userName
          ? await this.findCollaboratorByOptions({
              login: user.userName,
            })
          : null;
      filter = { [property]: coll ? coll.id : null };
    }
    return filter;
  }
}
