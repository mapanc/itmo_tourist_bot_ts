import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { isNumber } from "util";
import EventRepository from "../repositories/Event.repository";

export const createEvent = async (bot: Telegraf<Context<Update>>) => {
  bot.hears(/\/create_event\w*/gi, async (ctx: Context) => {
    const data = (ctx.message as any).text.split("\n");
    if (
      data.length === 7 &&
      typeof +data[4] === "number" &&
      +data[4] > 0 &&
      typeof +data[5] === "number" &&
      +data[5] > 0 &&
      typeof +data[6] === "number" &&
      +data[6] > 0
    ) {
      ctx.replyWithHTML(
        `Event name: <b>${data[1]}</b>\nDescription: <i>${data[2]}</i>\nUTM: ${data[3]}\nDifferent: ${data[6]}`
      );
      ctx.replyWithLocation(data[4], data[5]);
      await EventRepository.save({
        name: data[1],
        description: data[2],
        utm: data[3],
        latitude: +data[4],
        longitude: +data[5],
        different: +data[6],
      });
    }
  });
  return bot;
};
