import Handlebars from "handlebars";

export class TemplateHandlebarsService {
  /**
   *
   */
  constructor(registerHelpers?: (handlebar: typeof Handlebars) => unknown) {
    this.registerHelpers();
    if (registerHelpers) registerHelpers(Handlebars);
  }

  private registerHelpers() {
    Handlebars.registerHelper("dateDMY", function (str: string) {
      const date = new Date(str);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    });

    Handlebars.registerHelper("dateYMD", function (str: string) {
      const date = new Date(str);
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    });

    Handlebars.registerHelper("prod", function (o1: string, o2: string) {
      const op1 = parseFloat(o1);
      const op2 = parseFloat(o2);
      return `${Math.floor(op1 * op2 * 100) / 100}`;
    });

    Handlebars.registerHelper("div", function (o1: string, o2: string) {
      const op1 = parseFloat(o1);
      const op2 = parseFloat(o2);
      return `${Math.floor((op1 / op2) * 100) / 100}`;
    });

    Handlebars.registerHelper("sum", function (o1: string, o2: string) {
      const op1 = parseFloat(o1);
      const op2 = parseFloat(o2);
      return `${Math.floor((op1 + op2) * 100) / 100}`;
    });

    Handlebars.registerHelper("subs", function (o1: string, o2: string) {
      const op1 = parseFloat(o1);
      const op2 = parseFloat(o2);
      return `${Math.floor((op1 - op2) * 100) / 100}`;
    });

    Handlebars.registerHelper("valOrUnset", function (str: string) {
      return `${str ? str : "Unset"}`;
    });
  }

  public getTemplateData(template: string, data: any) {
    const handlTemplate = Handlebars.compile(template);
    return handlTemplate(data);
  }
}
