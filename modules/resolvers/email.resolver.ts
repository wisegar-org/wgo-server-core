import {
  EMAIL_PATH_SEND_EMAIL,
  EMAIL_PATH_SEND_EMAIL_FROM_TO_ADDRESS_AND_APP,
  EMAIL_PATH_SEND_EMAIL_FROM_TO_APP,
  EMAIL_PATH_SEND_EMAIL_TO_APP,
  IContextBase,
} from "@wisegar-org/wgo-base-models";

import { Arg, Ctx, Query, Resolver } from "type-graphql";

import { EmailResponse } from "./email.responses";
import { EmailService } from "../services/email.service";
import {
  WGEmailFromToAppInput,
  WGEmailInput,
  WGEmailToAddressAndAppInput,
  WGEmailToAppInput,
} from "./email.inputs";

@Resolver()
export class EmailResolver {
  @Query(() => EmailResponse, { name: EMAIL_PATH_SEND_EMAIL })
  async sendEmail(
    @Arg("data") data: WGEmailInput,
    @Ctx() ctx: IContextBase
  ): Promise<EmailResponse> {
    try {
      const wgEmailModel = new EmailService(ctx);
      const result = await wgEmailModel.sendEmail(data);
      return <EmailResponse>{
        error: "",
        isSuccess: result.isSuccess,
        sent: result.isSuccess,
      };
    } catch (error: any) {
      const emailResponse = new EmailResponse();
      emailResponse.error = error.message;
      emailResponse.isSuccess = false;
      return emailResponse;
    }
  }

  @Query(() => EmailResponse, { name: EMAIL_PATH_SEND_EMAIL_TO_APP })
  async sendEmailToApp(
    @Arg("data") data: WGEmailToAppInput,
    @Ctx() ctx: IContextBase
  ): Promise<EmailResponse> {
    try {
      const wgEmailModel = new EmailService(ctx);
      const result = await wgEmailModel.sendEmailToApp(data);
      return <EmailResponse>{
        error: "",
        isSuccess: result.isSuccess,
        sent: result.isSuccess,
      };
    } catch (error: any) {
      const emailResponse = new EmailResponse();
      emailResponse.error = error.message;
      emailResponse.isSuccess = false;
      return emailResponse;
    }
  }

  @Query(() => EmailResponse, { name: EMAIL_PATH_SEND_EMAIL_FROM_TO_APP })
  async sendEmailFromToApp(
    @Arg("data") data: WGEmailFromToAppInput,
    @Ctx() ctx: IContextBase
  ): Promise<EmailResponse> {
    try {
      const wgEmailModel = new EmailService(ctx);
      const result = await wgEmailModel.sendEmailFromToApp(data);
      return <EmailResponse>{
        error: "",
        isSuccess: result.isSuccess,
        sent: result.isSuccess,
      };
    } catch (error: any) {
      const emailResponse = new EmailResponse();
      emailResponse.error = error.message;
      emailResponse.isSuccess = false;
      return emailResponse;
    }
  }

  @Query(() => EmailResponse, {
    name: EMAIL_PATH_SEND_EMAIL_FROM_TO_ADDRESS_AND_APP,
  })
  async sendEmailFromToAddressAndApp(
    @Arg("data") data: WGEmailToAddressAndAppInput,
    @Ctx() ctx: IContextBase
  ): Promise<EmailResponse> {
    try {
      const wgEmailModel = new EmailService(ctx);
      const result = await wgEmailModel.sendEmailFromToAddressAndApp(data);
      return <EmailResponse>{
        error: "",
        isSuccess: result.isSuccess,
        sent: result.isSuccess,
      };
    } catch (error: any) {
      const emailResponse = new EmailResponse();
      emailResponse.error = error.message;
      emailResponse.isSuccess = false;
      return emailResponse;
    }
  }
}
