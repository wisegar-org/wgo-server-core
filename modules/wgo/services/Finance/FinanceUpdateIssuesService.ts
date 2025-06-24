import {
  getAllIssuesNotAccounted,
  getUserProfile,
  getIssuesComments,
  Issue,
  CommentGithub,
  IssueGithub,
  Repo,
} from "@wisegar-org/wgo-github";
import { IssueState } from "@wisegar-org/wgo-github/build/models/enums";
import {
  FinanceIssuesToken,
  FinanceIssuesZincTime,
  FinanceOrganizationSettings,
  WRONG_TOKEN,
} from "../../models/Finance";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import { FinanceCollaboratorService } from "./FinanceCollaboratorService";
import { FinanceIssuesService } from "./FinanceIssuesService";
import { FinanceLabelService } from "./FinanceLabelService";
import { FinanceProjectService } from "./FinanceProjectService";
import { FinanceRepositoryService } from "./FinanceRepositoryService";
import { SETTINGS_FINANCE_ORGANIZATION } from "./FinanceSettings";
import { ctx } from "../../handlers/AppContextHandler";
import { READ_ISSUES_INTERVAL } from "../../models/constants";
import { SettingsService } from "../../../services/settings.service";

export class FinanceUpdateIssuesService {
  async Update(ctx: IContextBase) {
    const repoController = new FinanceRepositoryService(ctx);
    const projController = new FinanceProjectService(ctx);
    const colController = new FinanceCollaboratorService(ctx);
    const labelController = new FinanceLabelService(ctx);
    const issueController = new FinanceIssuesService(ctx);

    const settingsModel = new SettingsService(ctx);
    const config = (await settingsModel.getSettingsObject({
      type_settings: SETTINGS_FINANCE_ORGANIZATION,
    })) as any as FinanceOrganizationSettings;
    const AccountLabel = config.FINANCE_ACCOUNTING_LABEL;
    const token = settingsModel.getSettingPasswordValue(
      config.FINANCE_ISSUES_TOKEN
    );

    if (!token) throw new Error(WRONG_TOKEN);

    const data: { [id: string]: Repo } = {};

    let notAccountedIssues: Issue[] = [];
    try {
      notAccountedIssues = await getAllIssuesNotAccounted(
        token,
        IssueState.closed,
        AccountLabel || "Accounted"
      );
    } catch (err) {
      console.log(err);
      notAccountedIssues = [];
    }

    if (notAccountedIssues.length > 0) {
      for (const issue of notAccountedIssues) {
        if (issue.repo != null) {
          const repoId = await repoController.updateOrInsertRepository(
            issue.repo.id,
            issue.repo.name
          );

          // Get Projects
          // const repoA = gh.getRepo(repo.owner.login, repo.name);
          // const projects = await repoA.listProjects();

          // for (const project of projects.data) {
          //   const proj = await projController.updateOrInsertProject(project.id, project.name);
          // }

          let labels_ids: string[] = [];

          for (const label of issue.labels || []) {
            try {
              await labelController.updateOrInsertLabel(label.id, label.name);
              labels_ids.push(label.name);
            } catch (error) {
              console.log("label error");
              console.log(label.id);
              console.log(label.name);
            }
          }

          // let milestoneId: string | null = null;
          // if (issue.milestones) {
          //   try {
          //     const mil = await milestoneController.updateOrInsertMilestone(
          //       issue.milestones.id,
          //       issue.milestones.title
          //     );
          //     milestoneId = issue.milestones.title;
          //   } catch (error) {
          //     console.log('milestone error');
          //     console.log(issue.milestones.id);
          //     console.log(issue.milestones.title);
          //   }
          // }
          let collaboratorId = null;
          if (issue.assignedTo) {
            try {
              const user = await getUserProfile(token, issue.assignedTo.login);

              const col = await colController.updateOrInsertCollaborator(
                issue.assignedTo.id,
                issue.assignedTo.login,
                issue.assignedTo.node_id,
                "WGO_FINANCE_COLLABORATOR_ROLE_COLLABORATOR",
                issue.assignedTo.avatar_url,
                issue.assignedTo.url,
                user.name || "",
                user.location || "",
                user.email || `${issue.assignedTo.login}@gmail.com` || "",
                user.bio || "",
                true
              );
              collaboratorId = col.id;
            } catch (error) {
              console.log("collaborator error");
              console.log(issue.assignedTo.id);
              console.log(issue.assignedTo.login);
            }
          }

          try {
            const col = await issueController.updateOrInsertIssue(
              issue.id,
              issue.repo.owner.login,
              issue.repo.name,
              issue.title,
              issue.status,
              issue.hours,
              issue.last_comment,
              new Date(issue.created_at),
              new Date(issue.closed_at),
              new Date(issue.updated_at),
              issue.number,
              issue.description,
              issue.url,
              collaboratorId || 0,
              0,
              repoId.id,
              labels_ids
            );
          } catch (error) {
            console.log("==========error==========");
            console.log(issue);
            console.log(error);
            console.log("---------------------------");
          }
        }
      }
    }
  }

  async SingleUpdate(
    ctx: IContextBase,
    token: string,
    issueGithub: IssueGithub,
    comment: CommentGithub,
    repo: Repo
  ) {
    if (issueGithub.state != "closed") {
      return;
    }

    const repoController = new FinanceRepositoryService(ctx);
    const projController = new FinanceProjectService(ctx);
    const colController = new FinanceCollaboratorService(ctx);
    const labelController = new FinanceLabelService(ctx);
    // const milestoneController = new MilestoneService();
    const issueController = new FinanceIssuesService(ctx);

    const settingsModel = new SettingsService(ctx);
    const config = (await settingsModel.getSettingsObject({
      type_settings: SETTINGS_FINANCE_ORGANIZATION,
    })) as any as FinanceOrganizationSettings;
    const AccountLabel = config.FINANCE_ACCOUNTING_LABEL;

    let isAccounted = false;

    let labels_ids: string[] = [];

    for (const label of issueGithub.labels) {
      if (
        label.name == "Accounted" ||
        (AccountLabel != null && AccountLabel == label.name)
      ) {
        isAccounted = true;
      } else {
        labels_ids.push(label.name);
      }
      try {
        const col = await labelController.updateOrInsertLabel(
          label.id,
          label.name
        );
      } catch (error) {
        console.log("label error");
        console.log(label.id);
        console.log(label.name);
      }
    }

    if (!isAccounted) {
      let hours = 0;
      let last_comment = "";
      if (comment !== null) {
        last_comment = comment.body;
        const matches = last_comment.match(/\d*.?\d*h/);
        if (matches && matches.length == 1) {
          hours = parseFloat(last_comment);
          if (isNaN(hours)) {
            hours = 0;
          }
        }
      } else if (issueGithub.comments > 0) {
        const comments = await getIssuesComments(
          token,
          repo.owner.login,
          repo.name,
          issueGithub.number
        );

        last_comment = comments[comments.length - 1].body as string;
        const matches = last_comment.match(/\d*.?\d*h/);
        if (matches && matches.length == 1) {
          hours = parseFloat(last_comment);
          if (isNaN(hours)) {
            hours = 0;
          }
        }
      }

      // let milestoneId: string | null = null;
      // if (issueGithub.milestone) {
      //   try {
      //     const mil = await milestoneController.updateOrInsertMilestone(
      //       issueGithub.milestone.id,
      //       issueGithub.milestone.title
      //     );
      //     milestoneId = issueGithub.milestone.title;
      //   } catch (error) {
      //     console.log('milestone error');
      //     console.log(issueGithub.milestone.id);
      //     console.log(issueGithub.milestone.title);
      //   }
      // }

      let collaboratorId = null;

      if (issueGithub.assignee) {
        const user = await getUserProfile(token, issueGithub.assignee.login);
        try {
          const col = await colController.updateOrInsertCollaborator(
            issueGithub.assignee.id,
            issueGithub.assignee.login,
            issueGithub.assignee.node_id,
            "WGO_FINANCE_COLLABORATOR_ROLE_COLLABORATOR",
            issueGithub.assignee.avatar_url,
            issueGithub.assignee.url,
            user.name || "",
            user.location || "",
            user.email || "",
            user.bio || "",
            true
          );
          collaboratorId = col.id;

          try {
            const col = await issueController.updateOrInsertIssue(
              issueGithub.id,
              repo.owner.login,
              repo.name,
              issueGithub.title,
              issueGithub.state,
              hours,
              last_comment,
              new Date(issueGithub.created_at),
              new Date(issueGithub.closed_at),
              new Date(issueGithub.updated_at),
              issueGithub.number,
              issueGithub.description,
              issueGithub.url,
              collaboratorId,
              0,
              repo.id,
              labels_ids
            );
          } catch (error) {
            console.log("==========error==========");
            console.log(issueGithub);
            console.log(hours);
            console.log(error);
            console.log("---------------------------");
          }
        } catch (error) {
          console.log("collaborator error");
          console.log(error);
          console.log(user);
        }
      } else if (issueGithub.assignees.length > 0) {
        // TODO: Revisar que hacer cuando no tiene asignado a nadie pero si tiene varios colaboradores
        // Por el momento nos quedamos con el primero de ellos

        const coll = issueGithub.assignees[0];
        const user = await getUserProfile(token, coll.login);

        try {
          const col = await colController.updateOrInsertCollaborator(
            coll.id,
            coll.login,
            coll.node_id,
            "WGO_FINANCE_COLLABORATOR_ROLE_COLLABORATOR",
            coll.avatar_url,
            coll.url,
            user.name || "",
            user.location || "",
            user.email || "",
            user.bio || "",
            true
          );
          collaboratorId = col.id;

          try {
            const col = await issueController.updateOrInsertIssue(
              issueGithub.id,
              repo.owner.login,
              repo.name,
              issueGithub.title,
              issueGithub.state,
              hours,
              last_comment,
              new Date(issueGithub.created_at),
              new Date(issueGithub.closed_at),
              new Date(issueGithub.updated_at),
              issueGithub.number,
              issueGithub.description,
              issueGithub.url,
              collaboratorId,
              0,
              repo.id,
              labels_ids
            );
          } catch (error) {
            console.log("==========error==========");
            console.log(issueGithub);
            console.log(hours);
            console.log(error);
            console.log("---------------------------");
          }
        } catch (error) {
          console.log("collaborator error");
          console.log(error);
          console.log(user);
        }
      }
    }
  }
}

let time = 0;

export const loopUpdateIssues = async (currentTime: number = 0) => {
  const updateIssuesService = new FinanceUpdateIssuesService();
  if (time === 0) {
    loadEvent();
    const settingsModel = new SettingsService(ctx);
    const config = (await settingsModel.getSettingsObject({
      type_settings: SETTINGS_FINANCE_ORGANIZATION,
    })) as any as FinanceOrganizationSettings;
    if (!time) time = config.FINANCE_ISSUES_ZINC_TIME;
  }
  try {
    await updateIssuesService.Update(ctx);
  } catch (err: any) {
    console.log(err.message);
  }

  if (time) {
    setTimeout(async () => {
      loopUpdateIssues(time);
    }, time * READ_ISSUES_INTERVAL);
  }
};

export const loadEvent = () => {
  ctx.emiter.on(FinanceIssuesZincTime.event, (value: number) => {
    time = value;
    loopUpdateIssues(time);
  });
  ctx.emiter.on(FinanceIssuesToken.event, (value: number) => {
    loopUpdateIssues(time);
  });
};
