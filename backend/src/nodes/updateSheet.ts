// src/nodes/updateSheet.ts
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export const updateSheetNode = async (state: any) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });

  const sheets = google.sheets({ version: "v4", auth: oAuth2Client });

  const values = [
    [
      new Date().toISOString(), // Timestamp
      state.name,               // Name
      state.email,              // Email
      state.role,               // Role
      state.empId || "",        // Employee ID
      "Started",                // Status
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID!,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    console.log("📋 Google Sheet updated with:", values[0]);

    return {
      ...state,
      status: "Logged to Sheet",
    };
  } catch (error) {
    console.error("❌ Failed to update Google Sheet:", error);
    return {
      ...state,
      error: "Sheet update failed",
    };
  }
};
