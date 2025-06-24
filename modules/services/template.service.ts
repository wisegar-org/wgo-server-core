import { DataSource, Repository } from "typeorm";
import { IContextBase } from "@wisegar-org/wgo-base-models";
import { TemplateInput } from "../resolvers/template.inputs";
import { TemplateEntity } from "../database/entities/TemplateEntity";
import { TranslationService } from "./translation.service";

export class TemplateService {
  private ctx: IContextBase;
  private dataSource: DataSource;
  private templateRepository: Repository<TemplateEntity>;
  private translationModel: TranslationService;
  /**
   *
   */
  constructor(ctx: IContextBase) {
    this.ctx = ctx;
    this.dataSource = this.ctx.dataSource;
    this.templateRepository = this.dataSource.getRepository(TemplateEntity);
    this.translationModel = new TranslationService(ctx);
  }

  async saveTamplate(data: TemplateInput) {
    let template: TemplateEntity | null = null;
    if (data.id) {
      template = await this.templateRepository.findOne({
        where: {
          id: data.id,
        },
      });
    }

    if (!template) {
      template = new TemplateEntity();
    }

    template.title = this.getTemplateKey(data.documentType, "title");
    await this.translationModel.setTranslationOptionalHistoric(
      this.ctx.language,
      template.title,
      data.title
    );
    template.body = this.getTemplateKey(data.documentType, "body");
    await this.translationModel.setTranslationOptionalHistoric(
      this.ctx.language,
      template.body,
      data.body
    );
    template.documentType = data.documentType;
    const result = await this.templateRepository.manager.save(template);
    return await this.ParseTemplate(result, data.documentType);
  }

  async getTemplateByType(documentType: string) {
    const template = await this.templateRepository.findOne({
      where: {
        documentType,
      },
    });
    return await this.ParseTemplate(template, documentType);
  }

  async ParseTemplate(template: TemplateEntity | null, type: string) {
    if (!template) return { id: 0, title: "", body: "", documentType: type };
    return {
      id: template.id,
      title: await this.translationModel.getTranslationValue(
        this.ctx.language,
        template.title
      ),
      body: await this.translationModel.getTranslationValue(
        this.ctx.language,
        template.body
      ),
      documentType: template.documentType,
    };
  }

  getTemplateKey(key: string, element: string) {
    return `WGO_${key}_${element}`.toUpperCase();
  }
}
