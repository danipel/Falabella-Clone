import {Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity
} from "typeorm";
import { Category } from "./category";

@Entity()
export class Subcategory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_subcategory: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => Category, { onDelete: "CASCADE" })
    category: Category;
}