import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1738946546572 implements MigrationInterface {
    name = 'SchemaUpdate1738946546572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."histories_action_enum" AS ENUM('SoftDelete', 'Delete', 'Add', 'Update', 'Restore', 'Access', 'Unknown')`);
        await queryRunner.query(`CREATE TABLE "histories" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "entity" character varying NOT NULL, "recordId" integer NOT NULL, "userId" integer NOT NULL, "username" character varying NOT NULL, "message" character varying NOT NULL, "action" "public"."histories_action_enum" NOT NULL, "snapshot" jsonb, CONSTRAINT "PK_36b0e707452a8b674f9d95da743" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_36b0e707452a8b674f9d95da74" ON "histories" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_abc92d8bb078e4f67191c142d4" ON "histories" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "languages" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "code" character varying NOT NULL DEFAULT '', "enabled" boolean NOT NULL DEFAULT false, "default" boolean NOT NULL DEFAULT false, "logoId" integer, CONSTRAINT "PK_b517f827ca496b29f4d549c631d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b517f827ca496b29f4d549c631" ON "languages" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4d60fce1da3ff986a5da4cd023" ON "languages" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "medias" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "displayName" character varying NOT NULL DEFAULT '', "fileName" character varying NOT NULL DEFAULT '', "fileExt" character varying NOT NULL DEFAULT '', "mimeType" character varying NOT NULL DEFAULT '', "fileContent" bytea NOT NULL, "isPublic" boolean DEFAULT false, "mediaType" character varying NOT NULL DEFAULT '', "path" character varying DEFAULT '', CONSTRAINT "PK_f27321557a66cd4fae9bc1ed6e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f27321557a66cd4fae9bc1ed6e" ON "medias" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bd31c6733ca9ef05a1e83ff612" ON "medias" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "translations" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "key" character varying NOT NULL, "value" character varying NOT NULL DEFAULT 'Empty', "languageId" integer, CONSTRAINT "PK_aca248c72ae1fb2390f1bf4cd87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aca248c72ae1fb2390f1bf4cd8" ON "translations" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f24fc2869d7b53ef295f93ad13" ON "translations" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c1433d71a4838793a49dcad46a" ON "roles" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_cdc7776894e484eaed828ca061" ON "roles" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "name" character varying NOT NULL DEFAULT '', "lastName" character varying NOT NULL DEFAULT '', "userName" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL DEFAULT '', "certificate" character varying NOT NULL DEFAULT '', "code" character varying DEFAULT '', "cap" character varying DEFAULT '', "phone" character varying DEFAULT '', "address" character varying DEFAULT '', "isEmailConfirmed" boolean NOT NULL DEFAULT false, "confirmationToken" character varying, "profileImageId" integer, "languageId" integer, CONSTRAINT "userName-unique" UNIQUE ("userName", "code"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3ffb1c0c8416b9fc6f907b743" ON "users" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_951b8f1dfc94ac1d0301a14b7e" ON "users" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "type_settings" character varying NOT NULL DEFAULT '', "settings" json NOT NULL DEFAULT '{}', CONSTRAINT "UQ_3157c63aeacaa43fb16861feb5c" UNIQUE ("type_settings"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0669fe20e252eb692bf4d34497" ON "settings" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_4ede76208970cde9dc26f4a4f8" ON "settings" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "storages" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "creatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "modificatoIl" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "cancellatoIl" TIMESTAMP, "type" character varying NOT NULL DEFAULT '', "content" json NOT NULL DEFAULT '{}', "imageId" integer, CONSTRAINT "PK_2f2d2fae6dc214f7f3ec52189ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2f2d2fae6dc214f7f3ec52189c" ON "storages" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_18f1b0b880b705e932a97b26dc" ON "storages" ("uuid") `);
        await queryRunner.query(`CREATE TABLE "users_roles" ("usersId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_37623035dbbec2f0a4b76ff4000" PRIMARY KEY ("usersId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_deeb1fe94ce2d111a6695a2880" ON "users_roles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_21db462422f1f97519a29041da" ON "users_roles" ("rolesId") `);
        await queryRunner.query(`CREATE TABLE "storages_medias" ("storagesId" integer NOT NULL, "mediasId" integer NOT NULL, CONSTRAINT "PK_ba005d3566916c937c928e8be69" PRIMARY KEY ("storagesId", "mediasId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f827f94f716d1d79756571d4d3" ON "storages_medias" ("storagesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_420f3f960070b6972d170f3f59" ON "storages_medias" ("mediasId") `);
        await queryRunner.query(`ALTER TABLE "languages" ADD CONSTRAINT "FK_1e4d7556eafd684cd5c4a3fc803" FOREIGN KEY ("logoId") REFERENCES "medias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "translations" ADD CONSTRAINT "FK_668111c72ac5c9eb05db93b9420" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e6f8c136a8e286370ac3b5d73b6" FOREIGN KEY ("profileImageId") REFERENCES "medias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_43e931f63c91f094d879aeeea29" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storages" ADD CONSTRAINT "FK_396b220fb380fca255a41ebc453" FOREIGN KEY ("imageId") REFERENCES "medias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_deeb1fe94ce2d111a6695a2880e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_roles" ADD CONSTRAINT "FK_21db462422f1f97519a29041da0" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "storages_medias" ADD CONSTRAINT "FK_f827f94f716d1d79756571d4d30" FOREIGN KEY ("storagesId") REFERENCES "storages"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "storages_medias" ADD CONSTRAINT "FK_420f3f960070b6972d170f3f59e" FOREIGN KEY ("mediasId") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storages_medias" DROP CONSTRAINT "FK_420f3f960070b6972d170f3f59e"`);
        await queryRunner.query(`ALTER TABLE "storages_medias" DROP CONSTRAINT "FK_f827f94f716d1d79756571d4d30"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_21db462422f1f97519a29041da0"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT "FK_deeb1fe94ce2d111a6695a2880e"`);
        await queryRunner.query(`ALTER TABLE "storages" DROP CONSTRAINT "FK_396b220fb380fca255a41ebc453"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_43e931f63c91f094d879aeeea29"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e6f8c136a8e286370ac3b5d73b6"`);
        await queryRunner.query(`ALTER TABLE "translations" DROP CONSTRAINT "FK_668111c72ac5c9eb05db93b9420"`);
        await queryRunner.query(`ALTER TABLE "languages" DROP CONSTRAINT "FK_1e4d7556eafd684cd5c4a3fc803"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_420f3f960070b6972d170f3f59"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f827f94f716d1d79756571d4d3"`);
        await queryRunner.query(`DROP TABLE "storages_medias"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21db462422f1f97519a29041da"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_deeb1fe94ce2d111a6695a2880"`);
        await queryRunner.query(`DROP TABLE "users_roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18f1b0b880b705e932a97b26dc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f2d2fae6dc214f7f3ec52189c"`);
        await queryRunner.query(`DROP TABLE "storages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ede76208970cde9dc26f4a4f8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0669fe20e252eb692bf4d34497"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_951b8f1dfc94ac1d0301a14b7e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3ffb1c0c8416b9fc6f907b743"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cdc7776894e484eaed828ca061"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1433d71a4838793a49dcad46a"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f24fc2869d7b53ef295f93ad13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aca248c72ae1fb2390f1bf4cd8"`);
        await queryRunner.query(`DROP TABLE "translations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd31c6733ca9ef05a1e83ff612"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f27321557a66cd4fae9bc1ed6e"`);
        await queryRunner.query(`DROP TABLE "medias"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d60fce1da3ff986a5da4cd023"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b517f827ca496b29f4d549c631"`);
        await queryRunner.query(`DROP TABLE "languages"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abc92d8bb078e4f67191c142d4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_36b0e707452a8b674f9d95da74"`);
        await queryRunner.query(`DROP TABLE "histories"`);
        await queryRunner.query(`DROP TYPE "public"."histories_action_enum"`);
    }

}
