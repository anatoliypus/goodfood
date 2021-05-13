import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

const stringCharset = "utf8";

@Entity({engine: "InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci"})
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "text", charset: stringCharset})
  category: string;
}
