import prisma from "../../prisma/prisma";
enum enabledEnum {
  one = "one",
  two = "two",
  three = "three",
  four = "four",
  five = "five",
}
const enabled = async (id: string, name: string): Promise<enabledEnum> => {
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: id,
    },
    include: {
      pupil: true,
    },
  });

  if (user) {
    if (!user.isActive) {
      return enabledEnum.three;
    }
    if (user.role === "USER") {
      if (user?.pupil[0]?.isActive) {
        return enabledEnum.five;
      }
      return enabledEnum.one;
    } else if (user.role === "ADMIN") {
      return enabledEnum.two;
    }

    return enabledEnum.one;
  } else {
    await prisma.user.create({
      data: {
        telegram_id: id,
        name: name,
        username: name,
      },
    });

    return enabledEnum.four;
  }
};

export default enabled;
