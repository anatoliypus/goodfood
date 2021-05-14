import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

const stringCharset = "utf8";

@Entity({engine: "InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci"})
export class Ingredients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "text", charset: stringCharset})
  ingredient: string;

  @Column({type: "text", charset: stringCharset})
  base: string;
}
