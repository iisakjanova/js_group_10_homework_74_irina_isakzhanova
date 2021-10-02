const express = require('express');
const fs = require('fs');

const path = "./messages";
const router = express.Router();

if (!fs.existsSync(path)){
  fs.mkdirSync(path);
}

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

const getListDir = async () => {
  let listDir = [];

  try {
    const files = await fs.promises.readdir(path);
    files.forEach(file => {
      listDir.push(path + '/' + file);
    });

  } catch (e) {
    console.error(e);
  }

  return listDir;
};

const getContents = async (dirs) => {
  let contents;

  try {
    const lastFiveDirsPromises = dirs.map(dir => fs.promises.readFile(dir, 'utf8'));
    contents = await Promise.all(lastFiveDirsPromises);
  } catch (e) {
    console.error(e);
  }

  return contents;
};

router.get('/', (req, res) => {
  (async () => {
    const listDir = await getListDir();
    const lastFiveDirs = listDir.slice(-5);
    const contents = await getContents(lastFiveDirs);
    const data = contents.map(content => JSON.parse(content));

    res.send(data);
  })();
});

module.exports = router;