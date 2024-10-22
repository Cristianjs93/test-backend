import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1729564743570 implements MigrationInterface {
  name = 'FirstMigration1729564743570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."services_category_enum" AS ENUM('Technology', 'Health', 'Home', 'Education', 'Transportation', 'Entertainment', 'Finance')`,
    );
    await queryRunner.query(
      `CREATE TABLE "services" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "cost" numeric NOT NULL, "category" "public"."services_category_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_services_services" ("usersId" integer NOT NULL, "servicesId" integer NOT NULL, CONSTRAINT "PK_4459b17cc118808743104613b07" PRIMARY KEY ("usersId", "servicesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1823d51c587a6c59707f92b77c" ON "users_services_services" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c893d39d2c66eded6e8fc4e16a" ON "users_services_services" ("servicesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_services_services" ADD CONSTRAINT "FK_1823d51c587a6c59707f92b77c9" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_services_services" ADD CONSTRAINT "FK_c893d39d2c66eded6e8fc4e16a1" FOREIGN KEY ("servicesId") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_services_services" DROP CONSTRAINT "FK_c893d39d2c66eded6e8fc4e16a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_services_services" DROP CONSTRAINT "FK_1823d51c587a6c59707f92b77c9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c893d39d2c66eded6e8fc4e16a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1823d51c587a6c59707f92b77c"`,
    );
    await queryRunner.query(`DROP TABLE "users_services_services"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TYPE "public"."services_category_enum"`);
  }
}
