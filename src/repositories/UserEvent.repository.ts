import { UserEvent } from "../entity/event.entity";
import AppDataSource from "./index.db";

export default AppDataSource.getRepository(UserEvent);
