import { DataSourceOptions } from "typeorm";
import { City } from "./src/entity/city.entity";
import { Event, UserEvent } from "./src/entity/event.entity";
import { UserLocation } from "./src/entity/user-location.entity";
import { User } from "./src/entity/user.entity";

export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "qwerty",
  database: "turist_db",
  synchronize: true,
  autoLoadEntities: true,
  entities: [User, UserLocation, City, Event, UserEvent],
  migrations: [],
  subscribers: [],
} as DataSourceOptions;
