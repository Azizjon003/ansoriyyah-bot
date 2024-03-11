const botStart = (bot: any) => {
  bot.launch().then(() => {
    console.log("Aziz");
  });
  bot.catch((err: any, ctx: any) => {
    console.log(`Ooops, encountered an error for ${ctx}`, err);
  });
  console.log(`Bot Azizjon has been started...`);
};

export default botStart;
