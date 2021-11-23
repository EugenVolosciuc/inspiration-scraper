import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  InspirationSourceName,
  inspirationSourceNames,
} from "../../types/InspirationSource";

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ type: "enum", enum: inspirationSourceNames })
  source: InspirationSourceName;
}
