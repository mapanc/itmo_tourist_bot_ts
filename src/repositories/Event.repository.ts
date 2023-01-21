import AppDataSource from "./index.db";
import { Event } from "../entity/event.entity";

export default AppDataSource.getRepository(Event);
