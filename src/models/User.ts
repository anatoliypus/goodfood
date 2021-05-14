import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from "typeorm";

const stringCharset = "utf8";

@Entity({engine: "InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci"})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: "timestamp"})
  createdAt: number;

  @UpdateDateColumn({type: "timestamp"})
  updatedAt: number;

  @DeleteDateColumn({type: "timestamp"})
  deletedAt: number;

  @Column({
    type: "text",
    charset: stringCharset,
  })
  firstName: string;

  @Column({
    type: "text",
    charset: stringCharset,
  })
  lastName: string;

  @Column({
    type: "text",
    charset: stringCharset,
  })
  email: string;

  @Column({
    type: "text",
    charset: stringCharset,
  })
  password: string;

  @Column({
    type: "simple-array",
    charset: stringCharset,
  })
  excluded_ingredients: string[];

  @Column({
    type: "simple-array",
    charset: stringCharset,
  })
  wishlist: number[];
}
