import { MigrationInterface, QueryRunner } from "typeorm";

export class createNewsletterMessageTable1668539669907
  implements MigrationInterface
{
  name = "createNewsletterMessageTable1668539669907";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agv_newsletter_message_entity" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "title" character varying NOT NULL DEFAULT '', "message" text NOT NULL DEFAULT '', "status" character varying NOT NULL DEFAULT 'In sospeso', CONSTRAINT "PK_ce8eed9818add0dd41a0e03638e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce8eed9818add0dd41a0e03638" ON "agv_newsletter_message_entity" ("id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d76046ab63e4dc6cb0e363806" ON "agv_newsletter_message_entity" ("uuid") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8d76046ab63e4dc6cb0e363806"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce8eed9818add0dd41a0e03638"`
    );
    await queryRunner.query(`DROP TABLE "agv_newsletter_message_entity"`);
  }
}
