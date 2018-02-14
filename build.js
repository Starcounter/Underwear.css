const express = require('express');
const fs = require('fs');
const puppeteer = require('puppeteer');

var host = '127.0.0.1';
var port = 5000;

var app = express();
app.use('/', express.static(__dirname + '/'));
app.listen(port, host);

puppeteer.launch().then(async browser => {
  const page = await browser.newPage();

  await page.goto('http://127.0.0.1:5000/src');

  const scriptElement = await page.addScriptTag({ url: '/assets/utils.js' });

  await page.evaluate(() => {
    for (const script of document.querySelectorAll('script')) script.remove();
  });

  const html = await page.evaluate('document.documentElement.innerHTML');
  fs.writeFileSync('index.html', html);
  await browser.close();
  process.exit(0);
});
