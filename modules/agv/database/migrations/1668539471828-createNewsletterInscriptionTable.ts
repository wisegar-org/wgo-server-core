import { MigrationInterface, QueryRunner } from "typeorm";

export class createNewsletterInscriptionTable1668539471828
  implements MigrationInterface
{
  name = "createNewsletterInscriptionTable1668539471828";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agv_newsletter_inscription_entity" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "email" character varying NOT NULL DEFAULT '', "status" character varying NOT NULL DEFAULT 'In sospeso', CONSTRAINT "PK_904dd74119c9657fd36fdf54478" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_904dd74119c9657fd36fdf5447" ON "agv_newsletter_inscription_entity" ("id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1930fee7c99d231c66e5d22449" ON "agv_newsletter_inscription_entity" ("uuid") `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1930fee7c99d231c66e5d22449"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_904dd74119c9657fd36fdf5447"`
    );
    await queryRunner.query(`DROP TABLE "agv_newsletter_inscription_entity"`);
  }
}
