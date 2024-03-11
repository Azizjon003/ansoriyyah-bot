import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import {
  chunkArrayInline,
  createInlineKeyboard,
  keyboards,
} from "../utils/keyboards";
import { isPupil } from "../utils/isPupil";
import { chatID } from "./homework";
const scene = new Scenes.BaseScene("control");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.hears("Kursga a'zo bo'lish", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const user_name = ctx.from?.first_name || ctx.from?.username;
  const enable = await isPupil(String(user_id));

  if (enable) {
    const pupil = await prisma.pupil.findFirst({
      where: {
        user: {
          telegram_id: String(user_id),
        },
      },
    });
    const text =
      "Siz allaqachon kursga a'zo bo'lgansiz" +
      "\n<i>" +
      pupil?.name +
      "</i> ismingiz";
    ctx.reply(text, {
      parse_mode: "HTML",
    });
    await prisma.user.updateMany({
      where: {
        telegram_id: String(user_id),
      },
      data: {
        action: "menu",
      },
    });
    ctx.scene.enter("start");
  } else {
    ctx.reply("Ismingizni aniq kiriting");
    ctx.session.user = {
      action: "register",
    };
    return;
  }
});

scene.hears("Uyga vazifa yuborish", (ctx: any) => {
  const text =
    "Vazifangizni yuboring\n\n Vazifani pdf ko'rinishida yuboring\nMasalan <b>1-dars 2-topshiriq</b> ko'rinishida\nDiqqat bir kunda 3 martagacha vazifa yuborishingiz mumkin";
  ctx.reply(text, {
    parse_mode: "HTML",
  });
  ctx.scene.enter("homework");
});

scene.hears("Murojaat qoldirish", (ctx: any) => {
  ctx.reply("Murojaat qoldirish.Faqat matnli xabar qoldirishingiz mumkin");
  ctx.scene.enter("contact");
});

scene.on("message", async (ctx: any) => {
  if (ctx.session.user?.action === "register") {
    const user_id = ctx.from?.id;
    const user_name = ctx.from?.first_name || ctx.from?.username;
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
    });
    if (!user) {
      ctx.reply("Siz allaqachon kursga a'zo bo'lgansiz");
      return;
    }
    await prisma.pupil.create({
      data: {
        name: ctx.message.text,
        userId: user.id,
        isActive: false,
      },
    });
    const groups = await prisma.groups.findMany();
    const keyboards = [];
    for (const group of groups) {
      keyboards.push([
        {
          text: group.users_name,
          callback_data: "target_" + group.id,
        },
      ]);
    }
    ctx.reply(
      "Qaysi guruhga qo'shilishingizni tanlang.Admin tasdiqlashini kuting biz sizga yopiq guruhga qo'shilish uchun link beramiz",
      {
        reply_markup: {
          inline_keyboard: keyboards,
        },
      }
    );

    ctx.session.user = {
      action: "target",
    };
    // ctx.telegram.sendMessage(
    //   chatID,
    //   `Yangi foydalanuvchi ro'yxatdan o'tdi\n <a href="tg://user?id=${user_id}">${user_name}</a> yangi foydalanuvchi\nU  guruhga a'zo bo'lmoqchi`,
    //   {
    //     parse_mode: "HTML",
    //     reply_markup: {
    //       inline_keyboard: [
    //         [
    //           {
    //             text: "Qabul qilish",
    //             callback_data: `add_${user?.id}`,
    //           },
    //           {
    //             text: "Rad etish",
    //             callback_data: `stop_${user?.id}`,
    //           },
    //         ],
    //       ],
    //     },
    //   }
    // );
    // ctx.scene.enter("start");
  } else {
    ctx.reply("Men sizni tushuna olmadim.Uzr meni qayta ishga tushuring");
  }
});
scene.action(/target_[0-9a-fA-F-]+/, async (ctx: any) => {
  const action = ctx.session.user?.action;
  if (action !== "target") {
    ctx.answerCbQuery("Siz allaqachon kursga a'zo bo'lgansiz");
    return;
  }
  const targetId = ctx.match.input.split("_")[1];
  const userId = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(userId),
    },
    include: {
      pupil: true,
    },
  });
  const group = await prisma.groups.findFirst({
    where: {
      id: String(targetId),
    },
  });
  if (!user) {
    return ctx.answerCbQuery("Foydalanuvchi topilmadi");
  }
  if (!group) {
    return ctx.answerCbQuery("Guruh topilmadi");
  }
  await ctx.telegram.deleteMessage(
    userId,
    ctx.callbackQuery?.message?.message_id
  );
  ctx.answerCbQuery("Qabul qilindingiz. Admin tasdiqlashini kuting");

  ctx.reply("Qabul qilindingiz. Admin tasdiqlashini kuting");

  ctx.telegram.sendMessage(
    chatID,
    `Yangi foydalanuvchi ro'yxatdan o'tdi\n <a href="tg://user?id=${userId}">${user?.pupil[0].name}</a> yangi foydalanuvchi\nU ${group.name} guruhga a'zo bo'lmoqchi`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Qabul qilish",
              callback_data: `add_${user?.id}`,
            },
            {
              text: "Rad etish",
              callback_data: `stop_${user?.id}`,
            },
          ],
        ],
      },
    }
  );
  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      action: "menu",
    },
  });

  ctx.scene.enter("start");
});
export default scene;
