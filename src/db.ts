import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./entities/user"
import { Category } from "./entities/category";
import { Section } from "./entities/section";
import { Subcategory } from "./entities/subcategory";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    entities: [User, Section, Category, Subcategory],
    logging : true,
    synchronize : true
})