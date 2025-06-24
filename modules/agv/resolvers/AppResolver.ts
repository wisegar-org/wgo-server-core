import { Query, Resolver } from "type-graphql";

@Resolver()
export class AppResolver {
  @Query(() => String)
  async getVersion() {
    return "v0.0.1";
  }
}
