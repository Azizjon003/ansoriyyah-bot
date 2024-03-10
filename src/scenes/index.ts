const { Scenes } = require("telegraf");
import start from "./start";
import control from "./control";
const stage = new Scenes.Stage([start, control]);

export default stage;
