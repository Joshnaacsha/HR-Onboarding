// scripts/getLabels.ts
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

async function getLabels() {
  const res = await gmail.users.labels.list({ userId: 'me' });
  const labels = res.data.labels || [];

  for (const label of labels) {
    console.log(`Label: ${label.name} → ID: ${label.id}`);
  }
}

getLabels().catch(console.error);
