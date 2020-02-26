const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const express = require('express');
const path = require('path');
const router = express.Router();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const TOKEN_PATH = path.join(__dirname, '../public/tools/token.json');

router.get('/drive_images', (req, res) => {

    // Load client secrets from a local file.
    fs.readFile(path.join(__dirname, '../public/tools/credentials.json'), (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        authorize(JSON.parse(content), listFiles);
        // authorize(JSON.parse(content), getFile);
        // authorize(JSON.parse(content), uploadFile);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);//list files and upload file
            // callback(oAuth2Client, '');//get file

        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error retrieving access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function listFiles(auth) {
        const drive = google.drive({ version: 'v3', auth });
        getList(drive, '');
    }
    function getList(drive, pageToken) {
        drive.files.list({
            corpora: 'user',
            // pageSize: 40,
            //q: "name='elvis233424234'",
            pageToken: pageToken ? pageToken : '',
            fields: 'nextPageToken, files(mimeType, id ,name)',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const files = res.data.files;
            if (files.length) {
                processList(files);
                if (res.data.nextPageToken) {
                    getList(drive, res.data.nextPageToken);
                }
            } else {
                console.log('No files found.');
            }
        });
    }
    function processList(files) {
        Drive_IMG_links = []
        files.forEach(file => {
            if (file.mimeType == 'image/jpeg') {
                Drive_IMG_links.push({ name: file.name, link: `https://drive.google.com/uc?export=view&id=${file.id}` })
            }
        });
        res.render(path.join(__dirname,"../views/index.ejs"),{"data":Drive_IMG_links})
    }
    function uploadFile(auth) {
        const drive = google.drive({ version: 'v3', auth });
        var fileMetadata = {
            'name': 'test22.jpg'
        };
        var media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream('test22.jpg')
        };
        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, function (err, res) {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                console.log('File Id: ', res.data.id);
            }
        });
    }
    function getFile(auth, fileId) {
        const drive = google.drive({ version: 'v3', auth });
        drive.files.get({ fileId: fileId, fields: '*' }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            console.log(res.data); c
        });
    }
})


module.exports = router;
