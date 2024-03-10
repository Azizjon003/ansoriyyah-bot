import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import {
  chunkArrayInline,
  createInlineKeyboard,
  keyboards,
} from "../utils/keyboards";
import { isPupil } from "../utils/isPupil";
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
      },
    });
    ctx.reply("Tabriklaymiz siz kursga a'zo boldingiz");
    ctx.session.user = {};
    ctx.scene.enter("start");
  } else {
    ctx.reply("Men sizni tushuna olmadim.Uzr meni qayta ishga tushuring");
  }
});
export default scene;
