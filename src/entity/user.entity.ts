import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { City } from "./city.entity";
import { Event } from "./event.entity";

@Entity()
export class User extends BaseEntity {
  @Column("bigint")
  telegramId: number;

  @Column()
  username: string;

  @Column()
  fullname: string;

  @Column({ nullable: true })
  region: string;

  @ManyToOne(() => City, { nullable: true })
  city: City;

  @JoinTable({ name: "user_event" })
  events: Event[];

  @Column()
  lang: string;
}
