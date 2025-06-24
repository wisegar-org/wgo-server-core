import { createEventTable1668534412569 } from "./1668534412569-createEventTable";
import { createInscriptionTable1668535321834 } from "./1668535321834-createInscriptionTable";
import { createPollTable1668539264505 } from "./1668539264505-createPollTable";
import { createNewsletterInscriptionTable1668539471828 } from "./1668539471828-createNewsletterInscriptionTable";
import { createNewsletterMessageTable1668539669907 } from "./1668539669907-createNewsletterMessageTable";
import { changeDateType1668550334970 } from "./1668550334970-changeDateType";

export const getAgvMigrations = () => {
  return [
    createEventTable1668534412569,
    createInscriptionTable1668535321834,
    createPollTable1668539264505,
    createNewsletterInscriptionTable1668539471828,
    createNewsletterMessageTable1668539669907,
    changeDateType1668550334970,
  ];
};
