import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity()
export class Event extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  utm: string;

  @Column("float")
  latitude: number;

  @Column("float")
  longitude: number;

  @Column("float")
  different: number;

  @JoinTable({ name: "user_event" })
  users: User[];
}

@Entity("user_event")
export class UserEvent {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  eventId: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  modified: Date;
}
