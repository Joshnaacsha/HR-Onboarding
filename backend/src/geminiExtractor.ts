// src/geminiExtractor.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function extractEmployeeWithGemini(emailBody: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
Extract the following fields from the email below:
- Name
- Email
- Role

Respond only in JSON format:
{
  "name": "...",
  "email": "...",
  "role": "..."
}
If email is not available, set it to null.

Text:
${emailBody}
`;

  const result = await model.generateContent(prompt);
  let response = await result.response.text();

  // ✅ Strip Markdown formatting if present (```json ... ```)
  response = response.trim();
  if (response.startsWith("```")) {
    response = response.replace(/```json|```/g, "").trim();
  }

  try {
    const json = JSON.parse(response);
    return json;
  } catch (e) {
    console.error("❌ Failed to parse Gemini response:", response);
    return { name: '', email: '', role: '' };
  }
}
