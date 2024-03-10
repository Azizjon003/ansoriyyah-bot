import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import {
  chunkArrayInline,
  createInlineKeyboard,
  keyboards,
} from "../utils/keyboards";
import { getBalance } from "../utils/isBalance";
const scene = new Scenes.BaseScene("control");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

export default scene;
