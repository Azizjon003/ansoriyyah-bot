import { Telegraf } from "telegraf";
import configs from "../utils/config";
import { keyboards } from "../utils/keyboards";
import prisma from "../../prisma/prisma";
import { chatID } from "../scenes/homework";

const bot = new Telegraf(String(configs.TOKEN));
const groups = [-1002075034438, -1002084811675];
bot.action(/check_[0-9a-fA-F-]+/, async (ctx: any) => {
  const userId = ctx.match.input.split("_")[1];
  const adminId = ctx.from?.id;
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery?.message?.message_id;
  const inlineMessageId = ctx.callbackQuery?.inlineMessageId;
  const user = await prisma.user.findFirst({
    where: {
      id: String(userId),
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
      id: String(userId),
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

bot.action(/add_[0-9a-fA-F-]+/, async (ctx: any) => {
  const userId = ctx.match.input.split("_")[1];
  const adminId = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      id: String(userId),
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

  ctx.answerCbQuery("Qabul qilindingiz");

  ctx.telegram.sendMessage(chatID, `Foydalanuvchi qabul qilindi ${user?.name}`);

  for (const group of groups) {
    const link = await bot.telegram.createChatInviteLink(group, {
      member_limit: 1,
      expire_date: Math.floor(Date.now() / 1000) + 300,
    });
    ctx.telegram.sendMessage(
      user?.telegram_id,
      `Yopiq guruhga qo'shilish uchun quyidagi havolani bosing ${link.invite_link}\n Link faqat 24 soatgacha amal qiladi`
    );
  }
  // ctx.telegram.editMessageCaption(
  //   chatId,
  //   messageId,
  //   inlineMessageId,
  //   "Vazifa tekshirildi\n" +
  //     file?.caption +
  //     "\n" +
  //     "Tekshiruvchi: " +
  //     admin?.name
  // );
});

bot.action(/stop_[0-9a-fA-F-]+/, async (ctx: any) => {
  const userId = ctx.match.input.split("_")[1];
  const adminId = ctx.from?.id;
  const chatId = ctx.chat?.id;
  const messageId = ctx.callbackQuery?.message?.message_id;
  const inlineMessageId = ctx.callbackQuery?.inlineMessageId;
  const user = await prisma.user.findFirst({
    where: {
      id: String(userId),
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

  ctx.answerCbQuery("So'rovingiz rad etildi");

  // ctx.telegram.editMessageCaption(
  //   chatId,
  //   messageId,
  //   inlineMessageId,
  //   "Vazifa rad etildi\n" + file?.caption + "\n" + "Rad etuvchi: " + admin?.name
  // );
  ctx.telegram.sendMessage(
    String(user?.telegram_id),
    "Sizning so'rovingiz rad etildi.Qayta yuborib ko'ring"
  );
});
export default bot;
