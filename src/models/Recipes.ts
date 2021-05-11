import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

const stringCharset = "utf8";

@Entity({engine: "InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci"})
export class Recipes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    charset: stringCharset,
  })
  title: string;

  @Column({
    type: "text",
    charset: stringCharset,
  })
  url: string;

  @Column({
    type: "text",
    charset: stringCharset,
  })
  cook_time: string;

  @Column({
    type: "text",
    charset: stringCharset,
  })
  ingredients_amount: string;

  @Column({
    type: "simple-json",
    charset: stringCharset,
  })
  steps: string[];

  @Column({
    type: "simple-array",
    charset: stringCharset,
  })
  ingredients: string[];

  @Column({
    type: "simple-array",
    charset: stringCharset,
  })
  images: string[];

  @Column({
    type: "simple-array",
    charset: stringCharset,
  })
  categories: string[];
}
