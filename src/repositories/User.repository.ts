import { User } from "../entity/user.entity";
import AppDataSource from "./index.db";

export default AppDataSource.getRepository(User);
