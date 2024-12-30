const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'www', 'index.html');
const oldPath = '/build/';
const newPath = '/shopcloud-web-components/build/';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    return console.error(err);
  }
  const result = data.replace(new RegExp(oldPath, 'g'), newPath);

  fs.writeFile(filePath, result, 'utf8', err => {
    if (err) return console.error(err);
    console.log('Paths replaced successfully.');
  });
});
