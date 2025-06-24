import { MigrationInterface, QueryRunner } from "typeorm";

export class createGithubFinanceDatabase1663797822990 implements MigrationInterface {
    name = 'createGithubFinanceDatabase1663797822990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "collaborator_entity" ("id" SERIAL NOT NULL, "id_github" integer NOT NULL DEFAULT '0', "name" character varying NOT NULL, "login" character varying NOT NULL, "node_id" character varying NOT NULL, "type" character varying NOT NULL, "avatar_url" character varying NOT NULL, "url" character varying NOT NULL, "location" character varying NOT NULL, "email" character varying NOT NULL, "bio" character varying NOT NULL, "isCollaborator" boolean NOT NULL DEFAULT true, "card_number" character varying DEFAULT '', "pay_by_hours" double precision DEFAULT '0', "address" character varying DEFAULT '', "cap" character varying DEFAULT '', "place" character varying DEFAULT '', CONSTRAINT "PK_b80f3c18df0557b5c1bd4fe28bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("id" integer NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_7a75a94e01d0b50bff123db1b87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "issue_entity" ("id" integer NOT NULL, "owner" character varying NOT NULL, "repo" character varying NOT NULL, "title" character varying NOT NULL, "status" character varying NOT NULL, "hours" double precision NOT NULL, "labels" character varying NOT NULL, "milestones" character varying NOT NULL, "last_comment" character varying, "created_at" TIMESTAMP NOT NULL, "closed_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "number" integer NOT NULL, "description" character varying, "url" character varying NOT NULL, "assignedToId" integer, "projectId" integer, "repositoryId" integer, "accountId" integer, CONSTRAINT "PK_6d2db63009063b9271093fd13b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "repository_entity" ("id" integer NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_5a277cb1f73162ceb6db9edc90f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_entity" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "initDate" TIMESTAMP, "endDate" TIMESTAMP, "total_hours" double precision NOT NULL, "total_projects" integer NOT NULL DEFAULT '0', "total_issues" integer NOT NULL DEFAULT '0', "total_repos" integer NOT NULL DEFAULT '0', "pay_by_hours" double precision NOT NULL DEFAULT '0', "pay_to_internet" double precision NOT NULL DEFAULT '0', "internet_cost" double precision DEFAULT '0', "taxes" double precision DEFAULT '0', "details" text DEFAULT '', "payment_comment" character varying DEFAULT '', "payment_code" character varying NOT NULL DEFAULT '', "status" integer NOT NULL DEFAULT '1', "value" double precision NOT NULL DEFAULT '0', "contributorId" integer, CONSTRAINT "PK_b482dad15becff9a89ad707dcbe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "label_entity" ("id" bigint NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_6655d360cb34f17da3b55cd4194" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_entity_projects_project_entity" ("accountEntityId" integer NOT NULL, "projectEntityId" integer NOT NULL, CONSTRAINT "PK_ec96719defdfda5161985a9a9dc" PRIMARY KEY ("accountEntityId", "projectEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d9050a42677084ade4239acb83" ON "account_entity_projects_project_entity" ("accountEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_55bdffb19fb4881b313a041c77" ON "account_entity_projects_project_entity" ("projectEntityId") `);
        await queryRunner.query(`CREATE TABLE "account_entity_repos_repository_entity" ("accountEntityId" integer NOT NULL, "repositoryEntityId" integer NOT NULL, CONSTRAINT "PK_db4b63bcd0c0f53d8c20cb00666" PRIMARY KEY ("accountEntityId", "repositoryEntityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9014e369bf1b684e82613627d5" ON "account_entity_repos_repository_entity" ("accountEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e6c2fa91ef068e9d8a23fee887" ON "account_entity_repos_repository_entity" ("repositoryEntityId") `);
        await queryRunner.query(`ALTER TABLE "issue_entity" ADD CONSTRAINT "FK_3d2cc4c126bf239d030d00bfeb1" FOREIGN KEY ("assignedToId") REFERENCES "collaborator_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue_entity" ADD CONSTRAINT "FK_e461713f6ed64dd6811435e9f2f" FOREIGN KEY ("projectId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue_entity" ADD CONSTRAINT "FK_3574bd4fc3f43630dc3c1060a29" FOREIGN KEY ("repositoryId") REFERENCES "repository_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue_entity" ADD CONSTRAINT "FK_778dff300e618856fdc30570272" FOREIGN KEY ("accountId") REFERENCES "account_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_entity" ADD CONSTRAINT "FK_0ed4428b7e2edf7126db84ebdf1" FOREIGN KEY ("contributorId") REFERENCES "collaborator_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_entity_projects_project_entity" ADD CONSTRAINT "FK_d9050a42677084ade4239acb831" FOREIGN KEY ("accountEntityId") REFERENCES "account_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_entity_projects_project_entity" ADD CONSTRAINT "FK_55bdffb19fb4881b313a041c770" FOREIGN KEY ("projectEntityId") REFERENCES "project_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_entity_repos_repository_entity" ADD CONSTRAINT "FK_9014e369bf1b684e82613627d5a" FOREIGN KEY ("accountEntityId") REFERENCES "account_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_entity_repos_repository_entity" ADD CONSTRAINT "FK_e6c2fa91ef068e9d8a23fee887f" FOREIGN KEY ("repositoryEntityId") REFERENCES "repository_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_entity_repos_repository_entity" DROP CONSTRAINT "FK_e6c2fa91ef068e9d8a23fee887f"`);
        await queryRunner.query(`ALTER TABLE "account_entity_repos_repository_entity" DROP CONSTRAINT "FK_9014e369bf1b684e82613627d5a"`);
        await queryRunner.query(`ALTER TABLE "account_entity_projects_project_entity" DROP CONSTRAINT "FK_55bdffb19fb4881b313a041c770"`);
        await queryRunner.query(`ALTER TABLE "account_entity_projects_project_entity" DROP CONSTRAINT "FK_d9050a42677084ade4239acb831"`);
        await queryRunner.query(`ALTER TABLE "account_entity" DROP CONSTRAINT "FK_0ed4428b7e2edf7126db84ebdf1"`);
        await queryRunner.query(`ALTER TABLE "issue_entity" DROP CONSTRAINT "FK_778dff300e618856fdc30570272"`);
        await queryRunner.query(`ALTER TABLE "issue_entity" DROP CONSTRAINT "FK_3574bd4fc3f43630dc3c1060a29"`);
        await queryRunner.query(`ALTER TABLE "issue_entity" DROP CONSTRAINT "FK_e461713f6ed64dd6811435e9f2f"`);
        await queryRunner.query(`ALTER TABLE "issue_entity" DROP CONSTRAINT "FK_3d2cc4c126bf239d030d00bfeb1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e6c2fa91ef068e9d8a23fee887"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9014e369bf1b684e82613627d5"`);
        await queryRunner.query(`DROP TABLE "account_entity_repos_repository_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_55bdffb19fb4881b313a041c77"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9050a42677084ade4239acb83"`);
        await queryRunner.query(`DROP TABLE "account_entity_projects_project_entity"`);
        await queryRunner.query(`DROP TABLE "label_entity"`);
        await queryRunner.query(`DROP TABLE "account_entity"`);
        await queryRunner.query(`DROP TABLE "repository_entity"`);
        await queryRunner.query(`DROP TABLE "issue_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP TABLE "collaborator_entity"`);
    }

}
