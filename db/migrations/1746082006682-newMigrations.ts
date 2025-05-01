import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1746082006682 implements MigrationInterface {
    name = 'NewMigrations1746082006682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tabs\` DROP FOREIGN KEY \`FK_b92e41514e13e0689b6c9c15b82\``);
        await queryRunner.query(`ALTER TABLE \`tabs\` CHANGE \`MENUID\` \`menuId\` int NULL`);
        await queryRunner.query(`CREATE TABLE \`user_stores\` (\`userStoreId\` int NOT NULL AUTO_INCREMENT, \`datecreated\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`dateModified\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`storeId\` int NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_c1ae840a5dd1c3b47e9e0295e7\` (\`userId\`), PRIMARY KEY (\`userStoreId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`password\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`username\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`userTypeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`middleName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`menus\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`menus\` CHANGE \`route\` \`route\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_472b25323af01488f1f66a06b67\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD UNIQUE INDEX \`IDX_472b25323af01488f1f66a06b6\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD UNIQUE INDEX \`IDX_6d1cb2e8c3ca15f7293464edad\` (\`mobile\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_472b25323af01488f1f66a06b6\` ON \`user_roles\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`user_stores\` ADD CONSTRAINT \`FK_fa944659f67025510ca20ccb7ed\` FOREIGN KEY (\`storeId\`) REFERENCES \`stores\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_stores\` ADD CONSTRAINT \`FK_c1ae840a5dd1c3b47e9e0295e71\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tabs\` ADD CONSTRAINT \`FK_4f7ed92a9fcd341b2218022c174\` FOREIGN KEY (\`menuId\`) REFERENCES \`menus\`(\`menuId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_472b25323af01488f1f66a06b67\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a8f61a419ce5313def9b0f4c21e\` FOREIGN KEY (\`userTypeId\`) REFERENCES \`user_types\`(\`userTypeId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a8f61a419ce5313def9b0f4c21e\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP FOREIGN KEY \`FK_472b25323af01488f1f66a06b67\``);
        await queryRunner.query(`ALTER TABLE \`tabs\` DROP FOREIGN KEY \`FK_4f7ed92a9fcd341b2218022c174\``);
        await queryRunner.query(`ALTER TABLE \`user_stores\` DROP FOREIGN KEY \`FK_c1ae840a5dd1c3b47e9e0295e71\``);
        await queryRunner.query(`ALTER TABLE \`user_stores\` DROP FOREIGN KEY \`FK_fa944659f67025510ca20ccb7ed\``);
        await queryRunner.query(`DROP INDEX \`REL_472b25323af01488f1f66a06b6\` ON \`user_roles\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP INDEX \`IDX_6d1cb2e8c3ca15f7293464edad\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` DROP INDEX \`IDX_472b25323af01488f1f66a06b6\``);
        await queryRunner.query(`ALTER TABLE \`user_roles\` ADD CONSTRAINT \`FK_472b25323af01488f1f66a06b67\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`userId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`menus\` CHANGE \`route\` \`route\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`menus\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`middleName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`userTypeId\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`username\``);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`REL_c1ae840a5dd1c3b47e9e0295e7\` ON \`user_stores\``);
        await queryRunner.query(`DROP TABLE \`user_stores\``);
        await queryRunner.query(`ALTER TABLE \`tabs\` CHANGE \`menuId\` \`MENUID\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`tabs\` ADD CONSTRAINT \`FK_b92e41514e13e0689b6c9c15b82\` FOREIGN KEY (\`MENUID\`) REFERENCES \`menus\`(\`menuId\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
