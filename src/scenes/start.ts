import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
import { chatID } from "./homework";
const scene = new Scenes.BaseScene("start");

export let keyboard = ["Kursga a'zo bo'lish", "Murojaat qoldirish"];
export let keyboard3 = [
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

  if (
    enable === "one" ||
    enable === "four" ||
    enable === "five" ||
    enable === "sex"
  ) {
    if (enable === "sex") {
      ctx.reply("Bosh menyudasiz", keyboards(keyboard3));
    } else {
      ctx.reply(
        `Assalomu alaykum va Rahmatullohi va barokatuh ✨🍃\n\nTalablar🥰\n\nTaklif va murojaatlar 💌\n\nVazifa 📑 larni yo‘llashingiz mumkin\n\nIlm ila iymon sari yo‘l\n\nسبيل إلى الإيمان عبر العلم`,
        keyboards(enable === "five" ? keyboard3 : keyboard)
      );
    }

    if (enable === "four") {
      ctx.telegram.sendMessage(
        chatID,
        "Yangi foydalanuvchi ro'yxatdan o'tdi" +
          "\n" +
          user_name +
          " yangi user"
      );
    }
    return ctx.scene.enter("control");
  } else if (enable === "two") {
    const text = "Assalomu alaykum Admin xush kelibsiz";
    ctx.reply(text, keyboards(keyboard2));
  } else if (enable === "three") {
    ctx.reply("Assalomu alaykum.Kechirasiz siz admin tomonidan bloklangansiz");
  }
});

export default scene;
