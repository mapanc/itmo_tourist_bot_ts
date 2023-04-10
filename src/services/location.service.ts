import { eventNames } from "process";
import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { UserLocation } from "../entity/user-location.entity";
import EventRepository from "../repositories/Event.repository";
import UserRepository from "../repositories/User.repository";
import UserEventRepository from "../repositories/UserEvent.repository";
import UserLocationRepository from "../repositories/UserLocation.repository";

export const onLocation = (bot: Telegraf<Context<Update>>) => {
  const onLocation = async (ctx: Context) => {
    const user = await UserRepository.findOne({
      where: { telegramId: ctx.from.id },
      relations: ["event"],
    });
    if (user.event) {
      const event = await EventRepository.findOne({
        where: { id: user.event.id },
      });
      const userLocation = {
        user,
        longitude: (ctx.message as any).location.longitude,
        latitude: (ctx.message as any).location.latitude,
      } as UserLocation;
      if (
        Math.abs(userLocation.longitude - event.longitude) > event.different &&
        Math.abs(userLocation.latitude - event.latitude) > event.different
      ) {
        ctx.replyWithHTML(
          `Вы находитесь слишком далеко. Данные не были записаны!`,
          {
            ...Markup.inlineKeyboard([
              Markup.button.callback("Моя последняя локация", "my_location"),
            ]),
          }
        );
      } else {
        ctx.replyWithHTML(
          `Вы находитесь в границах мероприятия. Данные успешно записаны.`,
          {
            ...Markup.inlineKeyboard([
              Markup.button.callback("Моя локация", "my_location"),
            ]),
          }
        );
        await UserLocationRepository.save(userLocation);
      }
    }
    // ctx.replyWithHTML("Выши данные были записаны!", {
    //   ...Markup.inlineKeyboard([
    //     Markup.button.callback("Моя локация", "my_location"),
    //   ]),
    // });
  };

  const onMyLocation = async (ctx: Context) => {
    const userLocation = await UserLocationRepository.findOne({
      where: { user: { telegramId: ctx.from.id } },
    });
    if (userLocation) {
      ctx.replyWithLocation(userLocation.latitude, userLocation.longitude);
    } else {
      ctx.replyWithHTML(`Инормация не найдена`);
    }
  };

  bot.on("location", onLocation);
  bot.action("my_location", onMyLocation);

  bot.on;

  return bot;
};
