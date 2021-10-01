const express = require('express');
const fs = require('fs');

const path = "./messages";
const router = express.Router();

router.post('/', (req, res) => {
  const date = new Date();
  const datetime = date.toISOString();
  const fileName = `./messages/${datetime}.txt`;

  const body = req.body;
  body.datetime = datetime;
  const data = JSON.stringify(body);

  fs.writeFile(fileName, data, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('File was saved!');
    }
  });

  res.send(body);
});

router.get('/', (req, res) => {
  (async () => {
    let listDir = [];

    try {
      const files = await fs.promises.readdir(path);
      files.forEach(file => {
        listDir.push(path + '/' + file);
      });

    } catch (e) {
      console.error(e);
    }

    const lastFiveDirs = listDir.slice(-5);

    let contents;

    try {
      const lastFiveDirsPromises = lastFiveDirs.map(dir => fs.promises.readFile(dir, 'utf8'));
      contents = await Promise.all(lastFiveDirsPromises);
    } catch (e) {
      console.error(e);
    }

    const data = contents.map(content => JSON.parse(content));
    res.send(data);
  })();
});

module.exports = router;