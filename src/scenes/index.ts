const { Scenes } = require("telegraf");
import start from "./start";
import control from "./control";
import homework from "./homework";
import contact from "./contact";
import sendMessage from "./sendMessage";
const stage = new Scenes.Stage([
  start,
  control,
  homework,
  contact,
  sendMessage,
]);

export default stage;
