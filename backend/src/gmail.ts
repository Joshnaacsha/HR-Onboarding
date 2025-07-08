import { google } from 'googleapis';
import dotenv from 'dotenv';
import { extractEmployeeWithGemini } from './geminiExtractor';

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

export async function getInitialOnboardingState(): Promise<any | null> {
  try {
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: `from:${process.env.TA_EMAIL} subject:(joiners) -label:processed`,
      maxResults: 1,
    });

    const messages = res.data.messages || [];
    if (messages.length === 0) {
      console.log("📭 No new joiner emails found.");
      return null;
    }

    const msg = messages[0];
    const msgData = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id!,
      format: 'full',
    });

    const payload = msgData.data.payload;
    const parts = payload?.parts;
    const bodyBase64 =
      parts?.[0]?.body?.data || payload?.body?.data || '';
    const body = Buffer.from(bodyBase64, 'base64').toString('utf-8');

    console.log("📩 Email Body Snippet:", body.slice(0, 300), "...");

    const employee = await extractEmployeeWithGemini(body);

    if (!employee?.email) {
      console.warn("⚠️ Gemini failed to extract employee info.");
      return null;
    }

    // ✅ Add label to mark as processed
    const labelName = "processed";
    const labelRes = await gmail.users.labels.list({ userId: 'me' });
    let labelId = labelRes.data.labels?.find(l => l.name === labelName)?.id;

    if (!labelId) {
      const createRes = await gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name: labelName,
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
        },
      });
      labelId = createRes.data.id!;
    }

    await gmail.users.messages.modify({
      userId: 'me',
      id: msg.id!,
      requestBody: {
        addLabelIds: [labelId],
      },
    });

    // ✅ Prepare state for LangGraph
    const state = {
      name: employee.name,
      email: employee.email,
      role: employee.role,
      rawEmailBody: body,
      taEmail: process.env.TA_EMAIL,
      currentStep: "acknowledge",
    };

    console.log("✅ Onboarding State Ready:", state);
    return state;
  } catch (err) {
    console.error("❌ Failed to initialize onboarding:", err);
    return null;
  }
}
