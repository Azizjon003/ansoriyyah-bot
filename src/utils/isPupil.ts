import prisma from "../../prisma/prisma";

export const isPupil = async (telegram_id: string) => {
  const isUser = await prisma.user.findFirst({
    where: {
      telegram_id: telegram_id,
      pupil: {
        some: {
          isActive: true,
        },
      },
    },
    include: {
      pupil: true,
    },
  });

  const isPupils = isUser?.pupil;

  if (isPupils?.length === 0) return false;
  const pupil = isPupils?.[0];
  if (!pupil?.isActive) return false;

  return true;
};
