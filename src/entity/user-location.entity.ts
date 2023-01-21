import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class UserLocation extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  userId?: number;

  @Column("float")
  latitude: number;

  @Column("float")
  longitude: number;
}
