import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("start");

export let keyboard = [
  "Kursga a'zo bo'lish",
  "Uyga vazifa yuborish",
  "Murojaat qoldirish",
];
export let keyboard2 = [
  "Foydalanuvchilar",
  "Hamma foydalanuchilarga xabar yuborish",
  "Bugungi statistika",
];
scene.enter(async (ctx: any) => {
  const user_id = ctx.from?.id;

  const user_name = ctx.from?.first_name || ctx.from?.username;

  const enable = await enabled(String(user_id), String(user_name));

  if (enable === "one") {
    ctx.reply(
      `Assalomu alaykum va rahmatullohi va barokatuh ✨🍃
    Talab 🗣️
    Taklif va murojatlar 💌
    Vazifa 📑 larni yoʻllashingiz mumkin
    .... Bu yerda birorta aqlli gap boʻladi`,
      keyboards(keyboard)
    );

    return ctx.scene.enter("control");
  } else if (enable === "two") {
    const text = "Assalomu alaykum Admin xush kelibsiz";
    ctx.reply(text, keyboards(keyboard2));
  } else if (enable === "three") {
    ctx.reply("Assalomu alaykum.Kechirasiz siz admin tomonidan bloklangansiz");
  }
});

export default scene;
