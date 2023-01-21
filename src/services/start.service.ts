import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { User } from "../entity/user.entity";
import UserRepository from "../repositories/User.repository";
import CityRepository from "../repositories/City.repository";
import EventRepository from "../repositories/Event.repository";
import UserEventRepository from "../repositories/UserEvent.repository";
import { UserEvent } from "../entity/event.entity";

export const onStart = async (bot: Telegraf<Context<Update>>) => {
  const onStart = async (ctx: Context) => {
    console.log(ctx);
    let user = await UserRepository.findOne({
      where: { telegramId: ctx.from.id },
      relations: ["city"],
    });
    if (!user) {
      const newUser = new User();
      newUser.telegramId = ctx.from.id;
      newUser.username = ctx.from.username;
      newUser.fullname = `${ctx.from.first_name || ""} ${
        ctx.from.last_name || ""
      }`.trim();
      newUser.lang = ctx.from.language_code;
      user = await UserRepository.save(newUser);
    }
    ctx.replyWithHTML(`<b>Hi, ${user.fullname || user.username}</b>!`);
    if (!user.city) {
      const regions = await CityRepository.createQueryBuilder("c")
        .select("c.region", "region")
        .groupBy("c.region")
        .orderBy("c.region")
        .getRawMany();
      const regionsHtml = regions
        .map((r, i) => `/region${i + 1} ${r.region}`)
        .join("\n");
      ctx.replyWithHTML(regionsHtml);
    }
    if ((ctx as any).startPayload) {
      console.log((ctx as any).startPayload);
      const event = await EventRepository.findOne({
        where: {
          utm: (ctx as any).startPayload,
        },
      });
      console.log(event);
      if (event) {
        const user = await UserRepository.findOne({
          where: { telegramId: ctx.from.id },
        });
        await UserEventRepository.save({
          userId: user.id,
          eventId: event.id,
        } as UserEvent);
      }
    }
  };

  const onRegion = async (ctx: Context) => {
    const index = +(ctx as any)?.match?.[0].replace("/region", "");
    const regions = await CityRepository.createQueryBuilder("c")
      .select("c.region", "region")
      .groupBy("c.region")
      .orderBy("c.region")
      .getRawMany();
    if (regions[index - 1]) {
      const cities = await CityRepository.createQueryBuilder("c")
        .select("c.city", "city")
        .where(regions[index - 1])
        .orderBy("c.city")
        .getRawMany();
      await UserRepository.update(
        { telegramId: ctx.from.id },
        { region: regions[index - 1].region }
      );
      const citiesHtml = cities
        .map((c, i) => `/city${i + 1} ${c.city}`)
        .join("\n");
      ctx.replyWithHTML(citiesHtml);
    }
  };

  const onCity = async (ctx: Context) => {
    const index = +(ctx as any)?.match?.[0].replace("/city", "");
    const cities = await CityRepository.createQueryBuilder("c")
      .innerJoin(User, "u", "u.telegramId = :id AND u.region = c.region", {
        id: ctx.from.id,
      })
      .orderBy("c.city")
      .getMany();
    ctx.replyWithHTML(`Выбран город ${cities[index - 1].city}`);
    await UserRepository.update(
      { telegramId: ctx.from.id },
      { city: cities[index - 1] }
    );
  };

  bot.start(onStart);
  bot.action(/start/gm, onStart);

  bot.hears(/\/city[0-9]*/gi, onCity);
  bot.hears(/\/region[0-9]*/gi, onRegion);
  return bot;
};
