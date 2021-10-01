const express = require('express');
const fs = require('fs');

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

module.exports = router;