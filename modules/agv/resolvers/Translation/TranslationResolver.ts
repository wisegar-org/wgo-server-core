// @InputType()
// export class ImportTranslationsInput {
//   @Field(() => GraphQLUpload, { description: "File uploaded", nullable: true })
//   file!: typeof GraphQLUpload;
// }

// @Resolver()
// export class PublicTranslationResolver {
//   @Mutation(() => Boolean, { name: TRANSLATION_PATH_IMPORT_TRANSLATION })
//   async importTranslations(
//     @Arg("data") data: ImportTranslationsInput,
//     @Ctx() ctx: IContextBase
//   ) {
//     const result = await this.importTranslationsPrivate(data, ctx);
//     return result;
//   }
// }
