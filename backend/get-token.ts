// get-token.ts
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

// Load client secrets from a local file
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf-8'));

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this URL:\n', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\nEnter the code from that page here: ', (code) => {
  rl.close();
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    console.log('\n✅ Your tokens:\n');
    console.log(JSON.stringify(token, null, 2));
    fs.writeFileSync('token.json', JSON.stringify(token));
  });
});
