import { Context, session, Telegraf } from "telegraf";
import * as dotenv from "dotenv";
import { onStart } from "./services/start.service";
import AppDataSource from "./repositories/index.db";
import UserRepository from "./repositories/User.repository";
import { onLocation } from "./services/location.service";
import { createEvent } from "./services/createEvent.service";
dotenv.config();

const TG_API_KEY = process.env.TG_API_KEY || "";

const main = async () => {
  let bot = new Telegraf(TG_API_KEY);
  bot.use(session());

  await AppDataSource.initialize()
    .then(() => console.log("db conected"))
    .catch((err) => console.log(err.message));

  console.log("Users count: ", await UserRepository.count());

  bot = await onStart(bot);
  bot = await onLocation(bot);
  bot = await createEvent(bot);

  bot.launch();
};

main();
