import { MigrationInterface, QueryRunner } from "typeorm";

export class changeDateType1668550334970 implements MigrationInterface {
  name = "changeDateType1668550334970";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agv_inscription_entity" ALTER COLUMN "inscriptionDate" SET DEFAULT ('now'::text)::timestamp(6) with time zone`
    );
    await queryRunner.query(
      `ALTER TABLE "agv_poll_entity" ALTER COLUMN "date" SET DEFAULT ('now'::text)::timestamp(6) with time zone`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "agv_poll_entity" ALTER COLUMN "date" SET DEFAULT '2022-11-15 21:45:52.096'`
    );
    await queryRunner.query(
      `ALTER TABLE "agv_inscription_entity" ALTER COLUMN "inscriptionDate" SET DEFAULT '2022-11-15 21:45:52.081'`
    );
  }
}
