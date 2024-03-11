import { Telegraf } from "telegraf";
import configs from "../utils/config";
import { keyboards } from "../utils/keyboards";
import prisma from "../../prisma/prisma";
import { chatID } from "../scenes/homework";

const bot = new Telegraf(String(configs.TOKEN));
const groups = [-1002075034438, -1002084811675];

bot.action(/group_-?\d+=(\d+)$/, async (ctx: any) => {
  console.log("Salom");
  const groupId = ctx.match.input.split("_")[1].split("=")[0];
  const user_telegram_id = ctx.match.input.split("_")[1].split("=")[1];
  const group = await prisma.groups.findFirst({
    where: {
      telegram_id: groupId,
    },
  });
  if (!group) {
    ctx.answerCbQuery("Guruh topilmadi");
  }
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: user_telegram_id,
    },
  });
  console.log(user);
  if (!user) {
    return ctx.answerCbQuery("Foydalanuvchi topilmadi");
  }
  const adminId = ctx.from?.id;
  const admin = await prisma.user.findFirst({
    where: {
      telegram_id: String(adminId),
    },
  });

  if (!admin) {
    ctx.answerCbQuery("Siz admin emassiz");
  }

  ctx.telegram.deleteMessage(chatID, ctx.callbackQuery?.message?.message_id);

  ctx.answerCbQuery("Qabul qildingiz");

  const link = await bot.telegram.createChatInviteLink(
    String(group?.telegram_id),
    {
      member_limit: 1,
      expire_date: Math.floor(Date.now() / 1000) + 300,
    }
  );

  ctx.telegram.sendMessage(
    user?.telegram_id,
    `Yopiq guruhga qo'shilish uchun quyidagi havolani bosing ${link.invite_link}\n Link faqat 5 minutgacha amal qiladi`
  );
  ctx.telegram.sendMessage(
    chatID,
    `Foydalanuvchi ${user?.name} guruhga qo'shildi`
  );

  await prisma.pupil.updateMany({
    where: {
      userId: user?.id,
    },
    data: {
      isActive: true,
    },
  });
});
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

  ctx.telegram.deleteMessage(chatID, ctx.callbackQuery?.message?.message_id);

  ctx.answerCbQuery("Qabul qilindingiz");
  const groups = await prisma.groups.findMany();
  const keyboards = [];
  for (const group of groups) {
    keyboards.push([
      {
        text: group.name,
        callback_data: "group_" + group.telegram_id + "=" + user?.telegram_id,
      },
    ]);
  }

  keyboards.push([
    {
      text: "Rad etish",
      callback_data: "stop_" + user?.id,
    },
  ]);

  console.log(keyboards);
  ctx.telegram.sendMessage(
    chatID,
    `Foydalanuvchini qaysi guruhga qo'shasiz ${user?.name}`,
    {
      reply_markup: {
        inline_keyboard: keyboards,
      },
    }
  );

  // for (const group of groups) {
  //   const link = await bot.telegram.createChatInviteLink(group, {
  //     member_limit: 1,
  //     expire_date: Math.floor(Date.now() / 1000) + 300,
  //   });
  //   ctx.telegram.sendMessage(
  //     user?.telegram_id,
  //     `Yopiq guruhga qo'shilish uchun quyidagi havolani bosing ${link.invite_link}\n Link faqat 24 soatgacha amal qiladi`
  //   );
  // }
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
  ctx.telegram.deleteMessage(chatID, ctx.callbackQuery?.message?.message_id);

  ctx.answerCbQuery("So'rovingiz rad etildi");

  ctx.telegram.sendMessage(chatID, `Foydalanuvchi ${user?.name} rad etildi`);
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
