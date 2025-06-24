import { MigrationInterface, QueryRunner } from "typeorm";

export class createInscriptionTable1668535321834 implements MigrationInterface {
    name = 'createInscriptionTable1668535321834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agv_inscription_entity" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "nome" character varying NOT NULL DEFAULT '', "cognome" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL DEFAULT '', "phone" character varying NOT NULL DEFAULT '', "message" character varying NOT NULL DEFAULT '', "class" character varying NOT NULL DEFAULT '', "inscriptionDate" TIMESTAMP NOT NULL DEFAULT '"2022-11-15T18:02:05.637Z"', "eventId" integer, CONSTRAINT "PK_483424a1776fddd377438190cb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_483424a1776fddd377438190cb" ON "agv_inscription_entity" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d1d15cb64aff297b8d1c086c02" ON "agv_inscription_entity" ("uuid") `);
        await queryRunner.query(`ALTER TABLE "agv_inscription_entity" ADD CONSTRAINT "FK_61abacbb1c67fafb7783a502b8d" FOREIGN KEY ("eventId") REFERENCES "agv_event_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "agv_inscription_entity" DROP CONSTRAINT "FK_61abacbb1c67fafb7783a502b8d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1d15cb64aff297b8d1c086c02"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_483424a1776fddd377438190cb"`);
        await queryRunner.query(`DROP TABLE "agv_inscription_entity"`);
    }

}
