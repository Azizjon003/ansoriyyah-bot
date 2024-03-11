require("dotenv").config();
import { Context, Middleware } from "telegraf";
import bot from "./core/bot";
import session from "./core/session";
import botStart from "./utils/startBot";
import stage from "./scenes/index";
import { SceneContext } from "telegraf/typings/scenes";
import prisma from "../prisma/prisma";

bot.use(session);

const middleware: Middleware<Context | SceneContext> = (ctx: any, next) => {
  ctx?.session ?? (ctx.session = {});
};
bot.use(stage.middleware());

bot.on("message", async (ctx: any, next) => {
  console.log(ctx.update?.message.reply_to_message);
  const testId = ctx.update?.message.reply_to_message?.message_id;
  const text = ctx.update?.message.text;

  const message = await prisma.message.findFirst({
    where: {
      message_id: String(testId),
    },
    include: {
      user: true,
    },
  });
  console.log(message);
  if (message) {
    ctx.telegram.sendMessage(message.user.telegram_id, text);
  }

  next();
});
bot.start((ctx: any) => ctx.scene.enter("start"));

bot.catch((err: any, ctx: any) => {
  console.log(`Ooops, encountered an error for ${ctx}`, err);
});
botStart(bot);

https: process.on("unhandledRejection", (reason, promise) => {
  console.error("Ushlanmagan rad etilgan va'da:", promise, "Sabab:");
});

process.on("uncaughtException", (error) => {
  console.error("Ushlanmagan istisno:", error);
});
