const { Scenes } = require("telegraf");
import start from "./start";
import control from "./control";
import homework from "./homework";
const stage = new Scenes.Stage([start, control, homework]);

export default stage;
