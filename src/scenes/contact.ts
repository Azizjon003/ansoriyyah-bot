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
const scene = new Scenes.BaseScene("contact");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const text = ctx.message.text;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });
  if (!user) return ctx.reply("Siz ro'yxatdan o'tmagansiz");

  ctx.telegram.sendMessage(
    chatID,
    text + "\n" + user?.name + " tomonidan yuborildi"
  );
  ctx.reply("Murojaatingiz qabul qilindi");
  ctx.scene.enter("start");
});

export default scene;
