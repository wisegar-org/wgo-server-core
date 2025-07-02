import { GetConfig } from "wgo-settings";

export const extraStyle = ``;

export const getInlineStyle = async (message: string) => {
  const msg = `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                ${extraStyle}
            </style>
        </head>
        <body>
            <div class="ql-editor">
                ${message}
            </div>
        </body>
    </html>
    `;

  const config = GetConfig<any>();
  const url = config.HOST_BASE;
  const inlineCss = require("inline-css");

  const result = await inlineCss(message, { url, extraCss: extraStyle });
  return result;
};
