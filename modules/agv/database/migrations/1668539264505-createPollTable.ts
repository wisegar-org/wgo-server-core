import { MigrationInterface, QueryRunner } from "typeorm";

export class createPollTable1668539264505 implements MigrationInterface {
  name = "createPollTable1668539264505";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "agv_poll_entity" ("id" SERIAL NOT NULL, "email" character varying NOT NULL DEFAULT '', "name" character varying NOT NULL DEFAULT '', "class" character varying NOT NULL DEFAULT '', "allowPhoto" boolean NOT NULL DEFAULT false, "allergy" boolean NOT NULL DEFAULT false, "foodAllergy" character varying NOT NULL DEFAULT '', "intolerance" boolean NOT NULL DEFAULT false, "foodIntolerance" character varying NOT NULL DEFAULT '', "parentName" character varying NOT NULL DEFAULT '', "parentEmail" character varying NOT NULL DEFAULT '', "phone" character varying NOT NULL DEFAULT '', "disposition" boolean NOT NULL DEFAULT false, "interest" boolean NOT NULL DEFAULT false, "date" TIMESTAMP NOT NULL DEFAULT '"2022-11-15T19:07:59.749Z"', CONSTRAINT "PK_0ec96a22183f32b61659b76f967" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "agv_poll_entity"`);
  }
}
