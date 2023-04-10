import { CronJob } from "cron";
import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import UserRepository from "../repositories/User.repository";

export const startCron = (bot: Telegraf<Context<Update>>) => {
  new CronJob(
    "0 0 */3 * * *",
    async () => {
      const users = await UserRepository.createQueryBuilder("u")
        .innerJoinAndSelect("u.event", "e")
        .where(`e.created > NOW() - INTERVAL '7 DAYS'`)
        .getMany();

      console.log(users.length);

      for (const user of users) {
        bot.telegram.sendMessage(
          user.telegramId,
          `Подтвердите своё нахождение на мероприятии ${user.event.name}`,
          {
            ...Markup.keyboard([
              Markup.button.locationRequest("Отправить гео-локацию"),
            ])
              .resize()
              .oneTime(),
          }
        );
      }
    },
    null,
    true,
    "America/Los_Angeles"
  ).start();
};
