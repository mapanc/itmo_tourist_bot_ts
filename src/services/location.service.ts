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
    ctx.replyWithHTML("Выши данные были записаны!", {
      ...Markup.inlineKeyboard([
        Markup.button.callback("Моя локация", "my_location"),
      ]),
    });
    const user = await UserRepository.findOne({
      where: { telegramId: ctx.from.id },
    });
    const userEvent = await UserEventRepository.findOne({
      where: { userId: user.id },
      order: { modified: "desc" },
    });
    const event = await EventRepository.findOne({
      where: { id: userEvent.eventId },
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
      ctx.replyWithHTML(`Вы находитесь слишком далеко`);
    } else {
      ctx.replyWithHTML(`Данные успешно записаны.`);
      await UserLocationRepository.save(userLocation);
    }
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
