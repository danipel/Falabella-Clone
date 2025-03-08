import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity
} from "typeorm";
import { Section } from "./section";

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id_category: number;

    @Column({ unique: true })
    name: string;

    @ManyToOne(() => Section, { onDelete: "CASCADE" })
    section: Section;
}
