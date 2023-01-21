import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class City extends BaseEntity {
  @Column()
  city: string;

  @Column()
  region: string;

  @OneToMany(() => User, (user) => user.city)
  user: User[];
}
