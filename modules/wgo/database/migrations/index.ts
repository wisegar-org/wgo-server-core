import { createIndexContentTb1663686346323 } from "./1663686346323-createIndexContentTb";
import { createGithubFinanceDatabase1663797822990 } from "./Finance/1663797822990-createGithubFinanceDatabase";

export const getWisegarMigrations = () => {
  return [
    createIndexContentTb1663686346323,
    createGithubFinanceDatabase1663797822990,
  ];
};
