// const fs = require('fs');
// const readline = require('readline');
// const { google } = require('googleapis');

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getNewToken(oAuth2Client: any, callback: any) {
// 	const authUrl = oAuth2Client.generateAuthUrl({
// 		access_type: 'offline',
// 		scope: SCOPES,
// 	});
// 	console.log('Authorize this app by visiting this url:', authUrl);
// 	const rl = readline.createInterface({
// 		input: process.stdin,
// 		output: process.stdout,
// 	});
// 	rl.question('Enter the code from that page here: ', (code: any) => {
// 		rl.close();
// 		oAuth2Client.getToken(code, (err: any, token: any) => {
// 			if (err) return console.error('Error while trying to retrieve access token', err);
// 			oAuth2Client.setCredentials(token);
// 			// Store the token to disk for later program executions
// 			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2: any) => {
// 				if (err2) return console.error(err2);
// 				console.log('Token stored to', TOKEN_PATH);
// 			});
// 			callback(oAuth2Client);
// 		});
// 	});
// }

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials: any, callback: any) {
// 	console.log(credentials);
// 	// eslint-disable-next-line camelcase
// 	const { client_secret, client_id } = credentials;
// 	const oAuth2Client = new google.auth.OAuth2(
// 		client_id, client_secret,
// 	);

// 	// Check if we have previously stored a token.
// 	fs.readFile(TOKEN_PATH, (err: any, token: any) => {
// 		if (err) return getNewToken(oAuth2Client, callback);
// 		oAuth2Client.setCredentials(JSON.parse(token));
// 		callback(oAuth2Client);
// 	});
// }

// /**
//  * Prints the names and majors of students in a sample spreadsheet:
//  * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
//  * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
//  */
// function listMajors(auth: any) {
// 	const sheets = google.sheets({ version: 'v4', auth });
// 	sheets.spreadsheets.values.get({
// 		spreadsheetId: '1XmFc32Fvd7UiBTRxvsgwGnR_1c69f7J3UlDgvTlkj8M',
// 		range: 'Class Data!A2:E',
// 	}, (err: any, res: any) => {
// 		if (err) return console.log(`The API returned an error: ${err}`);
// 		const rows = res.data.values;
// 		if (rows.length) {
// 			console.log('Name, Major:');
// 			// Print columns A and E, which correspond to indices 0 and 4.
// 			rows.forEach((row: any) => {
// 				console.log(`${row[0]}, ${row[4]}`);
// 			});
// 		} else {
// 			console.log('No data found.');
// 		}
// 	});
// }

// // Load client secrets from a local file.
// fs.readFile('./src/credentials.json', (err: any, content: any) => {
// 	if (err) return console.log('Error loading client secret file:', err);
// 	// Authorize a client with credentials, then call the Google Sheets API.
// 	authorize(JSON.parse(content), listMajors);
// });

import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import Credentials from './credentials.json';
import {PractitionerParser} from './parsers/PractitionerParser';

const start = async () => {
	const doc = new GoogleSpreadsheet('1XmFc32Fvd7UiBTRxvsgwGnR_1c69f7J3UlDgvTlkj8M');
	doc.useServiceAccountAuth(Credentials);

	await doc.loadInfo();
	console.log(doc.title);
	for (let i = 0; i < doc.sheetCount; i += 1) {
		const sheet = doc.sheetsByIndex[i];
		if (sheet.title === 'Practitioner') {
			// eslint-disable-next-line no-await-in-loop
			const rows = await sheet.getRows({ limit: 1, offset: 0 });
			const raw = rows[0]['_rawData'];
			const parser = new PractitionerParser();
			parser.parse([raw]);
			console.log(parser.parsed);
		}
	}
};

start();
