import { Telegraf } from "telegraf";
import configs from "../utils/config";
import { keyboards } from "../utils/keyboards";
import prisma from "../../prisma/prisma";

const bot = new Telegraf(String(configs.TOKEN));
bot.action(/check_[0-9a-fA-F-]+/, async (ctx: any) => {
  const userId = ctx.match.input.split("_")[1];
  const adminId = ctx.from?.id;
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery?.message?.message_id;
  const inlineMessageId = ctx.callbackQuery?.inlineMessageId;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    ctx.answerCbQuery("Foydalanuvchi topilmadi");
  }

  const admin = await prisma.user.findFirst({
    where: {
      telegram_id: String(adminId),
    },
  });

  if (!admin) {
    ctx.answerCbQuery("Siz admin emassiz");
  }
  const file = await prisma.homework.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  ctx.answerCbQuery("Vazifa tekshirildi");

  ctx.telegram.editMessageCaption(
    chatId,
    messageId,
    inlineMessageId,
    "Vazifa tekshirildi\n" +
      file?.caption +
      "\n" +
      "Tekshiruvchi: " +
      admin?.name
  );
  ctx.telegram.sendMessage(
    String(user?.telegram_id),
    "Sizning vazifangiz tekshirildi",
    keyboards([
      "Kursga a'zo bo'lish",
      "Uyga vazifa yuborish",
      "Murojaat qoldirish",
    ])
  );
});

bot.action(/cancel_[0-9a-fA-F-]+/, async (ctx: any) => {
  const userId = ctx.match.input.split("_")[1];
  const adminId = ctx.from?.id;
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery?.message?.message_id;
  const inlineMessageId = ctx.callbackQuery?.inlineMessageId;
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) {
    ctx.answerCbQuery("Foydalanuvchi topilmadi");
  }

  const admin = await prisma.user.findFirst({
    where: {
      telegram_id: String(adminId),
    },
  });

  if (!admin) {
    ctx.answerCbQuery("Siz admin emassiz");
  }
  const file = await prisma.homework.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  ctx.answerCbQuery("Vazifa rad etildi");

  ctx.telegram.editMessageCaption(
    chatId,
    messageId,
    inlineMessageId,
    "Vazifa rad etildi\n" + file?.caption + "\n" + "Rad etuvchi: " + admin?.name
  );
  ctx.telegram.sendMessage(
    String(user?.telegram_id),
    "Sizning vazifangiz rad etildi.Qayta yuborib ko'ring",
    keyboards([
      "Kursga a'zo bo'lish",
      "Uyga vazifa yuborish",
      "Murojaat qoldirish",
    ])
  );
});
export default bot;
