import { validate, ValidationError } from "class-validator";

export interface FormConstructor {
  new (): unknown;
}

export interface ResponseConstructor {
  new (): unknown;
}

export interface SimpleValidationError {
  property: string;
  errors: { [key: string]: string };
}

const P = <T>(property: (object: T) => void) => {
  const chaine = property.toString();
  const arr = chaine.match(/[\s\S]*{[\s\S]*\.([^\.; ]*)[ ;\n]*}/);
  return arr && arr.length > 0 ? arr[1] : null;
};

export class ExportableForm {
  transformError(error: ValidationError): SimpleValidationError {
    let errors: { [key: string]: string } = {};
    const eKeys = Object.keys(error.constraints || []);
    eKeys.map((key) => {
      errors[key] = error.constraints
        ? error.constraints[key].replace(/ /g, "_")
        : "";
    });
    return { property: error.property, errors: errors };
  }
  async parseBody(body: {
    [key: string]: string;
  }): Promise<SimpleValidationError[]> {
    const props = Object.getOwnPropertyNames(this);
    props.map((p) => {
      (this as any)[p] = undefined;
      if (body[p]) {
        (this as any)[p] = body[p];
      }
    });
    const errors = await validate(this);
    let parsedErrors: SimpleValidationError[] = [];
    if (errors.length == 0) return [];
    // TODO parse recursive for children
    errors.map((e) => {
      parsedErrors.push(this.transformError(e));
    });
    return parsedErrors;
  }
}
