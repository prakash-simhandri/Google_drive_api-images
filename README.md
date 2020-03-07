# Google_drive_api-images
In this project, I have shown the images of the public folder `Images` of my Drive, to the web-browser using <b>Google-Drive-API</b>, (https://developers.google.com/drive/api/v3/quickstart/nodejs) Open this link to setup Google-Drive-API on your system. 
I have integrated the Drive API to authenticate using access-token for the email. After that, I have used `expressJS` and made a <b>get</b> request to obtain the link of all the public folder images and passed the links to `index.ejs` file present in views folder to integrate them into a image slider that currently runs on localhost server.

### The Requirements

If you're using Linux, install `nodejs` and `npm` (node-package-manager) by running following commands in your Terminal.

```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm

```

To install `ejs` (Embedded-JavaScript), run the following command in your Terminal.
```
npm install ejs --save
```

To install Google-API, run the following command on your terminal.

```
npm install googleapis@39 --save
```

If you're using Windows, download NodeJS and npm from its official website.
https://nodejs.org/en/

#### How To Run?

Open your Terminal, type following command to start your localhost server.
```
node index.js
```
# Happy Codeing :)
