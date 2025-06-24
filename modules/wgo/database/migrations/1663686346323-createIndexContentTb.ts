import { MigrationInterface, QueryRunner } from "typeorm";

export class createIndexContentTb1663686346323 implements MigrationInterface {
  name = "createIndexContentTb1663686346323";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "index_content_entity" ("id" SERIAL NOT NULL, "imageId" integer, CONSTRAINT "PK_8eea73d1f17017a43ac22a6d4a8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "index_content_entity" ADD CONSTRAINT "FK_7a1255ae01ce33ffafa866f46e1" FOREIGN KEY ("imageId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "index_content_entity" DROP CONSTRAINT "FK_7a1255ae01ce33ffafa866f46e1"`
    );
    await queryRunner.query(`DROP TABLE "index_content_entity"`);
  }
}
