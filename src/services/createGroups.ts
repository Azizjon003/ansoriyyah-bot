import prisma from "../../prisma/prisma";

const main = async () => {
  const data = [
    {
      name: "Ansoriyyah {Grammatika} 💌",
      telegram_id: "-1002084811675",
      users_name: "Grammatika",
    },
    {
      name: "Ansoriyyah { Bayna yadayk}💌",
      telegram_id: "-1002075034438",
      users_name: "Banyda yadayk",
    },
  ];

  const groups = await prisma.groups.createMany({
    data: data,
  });
};

main();
