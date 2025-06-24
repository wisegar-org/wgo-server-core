import { MigrationInterface, QueryRunner } from "typeorm";

export class createEventTable1668534412569 implements MigrationInterface {
    name = 'createEventTable1668534412569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agv_event_entity" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "title" character varying NOT NULL, "description" text NOT NULL DEFAULT '', "shortDescription" text NOT NULL DEFAULT '', "class" character varying NOT NULL DEFAULT '', "type" character varying NOT NULL DEFAULT 'Evento', "startDate" TIMESTAMP, "endDate" TIMESTAMP, "visible" boolean NOT NULL DEFAULT true, "enrollment" boolean NOT NULL DEFAULT true, "state" character varying NOT NULL DEFAULT 'In sospeso', "imgTitleId" integer, CONSTRAINT "PK_00ce62d8746dd95e081560ee4eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_00ce62d8746dd95e081560ee4e" ON "agv_event_entity" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_75fb46b0a9dfab465632241b3d" ON "agv_event_entity" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "agv_event_entity_img_list_media" ("agvEventEntityId" integer NOT NULL, "mediaId" integer NOT NULL, CONSTRAINT "PK_d42cba52ac04f62b12b2ffbd0c2" PRIMARY KEY ("agvEventEntityId", "mediaId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8c9f47661fa97dceee1fb5871f" ON "agv_event_entity_img_list_media" ("agvEventEntityId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e8612721f80627540bbdf6c833" ON "agv_event_entity_img_list_media" ("mediaId") `);
        await queryRunner.query(`ALTER TABLE "agv_event_entity" ADD CONSTRAINT "FK_b210986cc66a9be116b6b20a784" FOREIGN KEY ("imgTitleId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agv_event_entity_img_list_media" ADD CONSTRAINT "FK_8c9f47661fa97dceee1fb5871f8" FOREIGN KEY ("agvEventEntityId") REFERENCES "agv_event_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "agv_event_entity_img_list_media" ADD CONSTRAINT "FK_e8612721f80627540bbdf6c8334" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agv_event_entity_img_list_media" DROP CONSTRAINT "FK_e8612721f80627540bbdf6c8334"`);
        await queryRunner.query(`ALTER TABLE "agv_event_entity_img_list_media" DROP CONSTRAINT "FK_8c9f47661fa97dceee1fb5871f8"`);
        await queryRunner.query(`ALTER TABLE "agv_event_entity" DROP CONSTRAINT "FK_b210986cc66a9be116b6b20a784"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e8612721f80627540bbdf6c833"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8c9f47661fa97dceee1fb5871f"`);
        await queryRunner.query(`DROP TABLE "agv_event_entity_img_list_media"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75fb46b0a9dfab465632241b3d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_00ce62d8746dd95e081560ee4e"`);
        await queryRunner.query(`DROP TABLE "agv_event_entity"`);
    }

}
