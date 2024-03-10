import OpenAI from "openai";
import { rejalarniAjratibOlish } from "../utils/textToPlans";
require("dotenv").config();
const key = process.env["OPEN_AI_KEY"] || "";
console.log(key);
const openai = new OpenAI({
  apiKey: String(key), // This is the default and can be omitted
});
async function createPlans(name: string, pages: number) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        content: `Make a plan for power point as much as the professor can make on the given topic. Make a plan for ${pages} for me. Make sure the plans are clear and consist of one sentence. use is prohibited. Plans should be in Uzbek`,
        // content: `Sen menga berilgan mavzu bo'yicha professor tuzib bera oladigan darajada power point uchun reja tuzib ber.Menga ${pages} ta rejali qilib tuzib ber.Bunda rejalar aniq va bitta gapdan iborat bo'lsin.Beriladigan matnda faqat rejalar bo'lsin ortiqcha gaplardan foydalanish  taqiqlanadi.`,
      },
    ],
    model: "gpt-3.5-turbo-0125",
    max_tokens: 4096,
  });

  console.log(chatCompletion.choices);

  let text = chatCompletion.choices[0].message.content;

  const reja = rejalarniAjratibOlish(String(text));
  return reja;
}

createPlans("Uy hayvonlari", 15);
export async function createPlansDescription(description: string) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: description },
      {
        role: "system",
        content: ``,
        // content: `Sen menga berilgan mavzu bo'yicha professor tuzib bera oladigan darajada power point uchun reja tuzib ber.Menga ${pages} ta rejali qilib tuzib ber.Bunda rejalar aniq va bitta gapdan iborat bo'lsin.Beriladigan matnda faqat rejalar bo'lsin ortiqcha gaplardan foydalanish  taqiqlanadi.`,
      },
    ],
    model: "gpt-3.5-turbo-0125",
    max_tokens: 4096,
  });
}
