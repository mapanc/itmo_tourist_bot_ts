import { UserLocation } from "../entity/user-location.entity";
import AppDataSource from "./index.db";

export default AppDataSource.getRepository(UserLocation);
