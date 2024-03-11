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
const scene = new Scenes.BaseScene("sendMessages");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
      role: "ADMIN",
    },
  });

  const message = ctx.message.text;
  const users = await prisma.user.findMany({});

  for (let i = 0; i < users.length; i++) {
    try {
      ctx.telegram.sendMessage(users[i].telegram_id, message);
    } catch (error) {
      console.log(error);
      ctx.reply("Xatolik yuz berdi");
    }
  }
});

export default scene;