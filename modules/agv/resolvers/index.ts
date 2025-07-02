import { PublicMediaResolver } from "./Media/MediaResolver";
import { AGVEventResolver } from "./Event/AGVEventResolver";
import { AGVContentsResolver } from "./Content/AGVContentsResolver";
import { AGVNewsletterResolver } from "./Newsletter/AGVNewsletterResolver";
import { AGVInscriptionResolver } from "./Inscription/AGVInscriptionResolver";
import { AppResolver } from "./AppResolver";
import { NonEmptyArray } from "type-graphql";
import { CoreResolver } from "../../core/resolvers/core.resolver";
import { AuthResolver } from "../../core/resolvers/authentication.resolver";
import { LanguageResolver } from "../../core/resolvers/language.resolver";
import { SettingsResolver } from "../../core/resolvers/settings.resolver";
import { TemplateResolver } from "../../core/resolvers/template.resolver";
import { HistoricResolver } from "../../core/resolvers/history.resolver";
import { EmailResolver } from "../../core/resolvers/email.resolver";

export const getResolverList = () => {
  return [
    AppResolver,
    CoreResolver,
    AuthResolver,
    LanguageResolver,
    SettingsResolver,
    PublicMediaResolver,
    TemplateResolver,
    HistoricResolver,
    EmailResolver,
    AGVEventResolver,
    AGVContentsResolver,
    AGVNewsletterResolver,
    AGVInscriptionResolver,
  ] as NonEmptyArray<Function>;
};
