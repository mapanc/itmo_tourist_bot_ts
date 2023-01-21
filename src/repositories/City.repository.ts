import { City } from "../entity/city.entity";
import AppDataSource from "./index.db";

export default AppDataSource.getRepository(City);
