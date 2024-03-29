import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import {
  chunkArrayInline,
  createInlineKeyboard,
  keyboards,
} from "../utils/keyboards";
import { isPupil } from "../utils/isPupil";
export const chatID = -1002061554438;
const scene = new Scenes.BaseScene("homework");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.on("document", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const extention = ctx.message.document?.file_name?.split(".").pop();
  const file_id = ctx.message.document?.file_id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
    include: {
      pupil: true,
    },
  });
  if (!user) return ctx.reply("Siz ro'yxatdan o'tmagansiz");
  const caption = ctx.message.caption;
  const enable = await isPupil(String(user_id));
  if (!enable) {
    ctx.reply("Siz talaba emassiz");
    return ctx.scene.enter("start");
  }

  if (extention === "pdf") {
    const current = new Date().setHours(0, 0, 0, 0);
    const isCountFile = await prisma.homework.count({
      where: {
        userId: user?.id,
        created_at: {
          gte: new Date(current).toISOString(),
        },
      },
    });

    if (isCountFile >= 3) {
      ctx.reply(
        "Siz bir kunda 3 marta vazifa yuborishingiz mumkin.Bu 3 imkoniyatdan foydalanib bo'ldingiz"
      );
      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          action: "menu",
        },
      });
      return ctx.scene.enter("start");
    }
    await prisma.homework.create({
      data: {
        userId: user?.id,
        file_id: String(file_id),
        caption: caption + " " + user?.pupil[0].name + " tomonidan yuborildi",
      },
    });
    ctx.reply(
      "Vazifa qabul qilindi.Iltimos sabr qilib kutib turing.Sizning vazifangizni tekshirish uchun adminlarimizga xabar yuboriladi"
    );

    ctx.telegram.sendDocument(chatID, file_id, {
      caption: caption + " " + user?.pupil[0].name + " tomonidan yuborildi",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Tekshirilganini bildirish",
              callback_data: `check_${user?.id}`,
            },
            {
              text: "Rad etish",
              callback_data: `cancel_${user?.id}`,
            },
          ],
        ],
      },
    });
  } else {
    ctx.reply("Faqat pdf formatda yuboring");
  }

  ctx.scene.enter("start");
});

scene.on("voice", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const file_id = ctx.message.voice?.file_id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
    include: {
      pupil: true,
    },
  });
  if (!user) return ctx.reply("Siz ro'yxatdan o'tmagansiz");
  const caption = ctx.message.caption;
  const enable = await isPupil(String(user_id));
  if (!enable) {
    ctx.reply("Siz talaba emassiz");
    return ctx.scene.enter("start");
  }
  const current = new Date().setHours(0, 0, 0, 0);
  const isCountFile = await prisma.homework.count({
    where: {
      userId: user?.id,
      created_at: {
        gte: new Date(current).toISOString(),
      },
    },
  });

  if (isCountFile >= 3) {
    ctx.reply(
      "Siz bir kunda 3 marta vazifa yuborishingiz mumkin.Bu 3 imkoniyatdan foydalanib bo'ldingiz"
    );
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        action: "menu",
      },
    });

    return ctx.scene.enter("start");
  }
  await prisma.homework.create({
    data: {
      userId: user?.id,
      file_id: String(file_id),
      caption: caption + " " + user?.pupil[0].name + " tomonidan yuborildi",
    },
  });
  ctx.reply(
    "Vazifa qabul qilindi.Iltimos sabr qilib kutib turing.Sizning vazifangizni tekshirish uchun adminlarimizga xabar yuboriladi"
  );

  ctx.telegram.sendDocument(chatID, file_id, {
    parse_mode: "HTML",
    caption: caption
      ? caption
      : "hech qanday qo'shimcha ma'lumotlar yo'q" +
        " " +
        `<a href="tg://user?id=${user_id}">${user?.pupil[0].name}</a>` +
        " tomonidan yuborildi",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Tekshirilganini bildirish",
            callback_data: `check_${user?.id}`,
          },
          {
            text: "Rad etish",
            callback_data: `cancel_${user?.id}`,
          },
        ],
      ],
    },
  });

  ctx.scene.enter("start");
});

export default scene;
