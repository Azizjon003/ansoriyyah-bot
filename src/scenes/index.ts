const { Scenes } = require("telegraf");
import start from "./start";
import control from "./control";
import homework from "./homework";
import contact from "./contact";
const stage = new Scenes.Stage([start, control, homework, contact]);

export default stage;
