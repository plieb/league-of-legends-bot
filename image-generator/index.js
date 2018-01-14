var fs = require('fs'),
    PNG = require('node-png').PNG;

const _ = require('lodash');
const express = require('express');

const assets = {};

const readPng = path => new Promise((f, r) => {
  fs.createReadStream(path)
    .pipe(new PNG({
      filterType: 4,
    }))
    .on('parsed', function() { f(this) })
    .on('error', r)
});

const files = fs.readdirSync('./assets');
Promise.all(files.map(file => {
  console.log(file)
  return readPng('./assets/' + file)
    .then(data => {
      if (!data) {
        console.log('error with: ', file);
      }
      return {
        data,
        name: file.replace('.png', ''),
      };
    });
}))
  .then(res => res.forEach(image => assets[image.name] = image.data))
  .then(() => {
  })
  .catch(console.error)

function mix(a, b) {
  const res = a;
  res.data = Buffer.from(a.data);
  for (let y = 0; y < a.height; y++) {
    for (let x = 0; x < a.width; x++) {
      if (x > a.width / 2) {
        const idx = (a.width * y + x) << 2;
        res.data[idx] = b.data[idx];
        res.data[idx + 1] = b.data[idx + 1];
        res.data[idx + 2] = b.data[idx + 2];
        res.data[idx + 3] = b.data[idx + 3];
      }
    }
  }
  return res;
}

express()
  .get('/', (req, res) => {
    console.log(req.query);
    const mixed = mix(assets[req.query.left], assets[req.query.right]);
    mixed.pack().pipe(res);
  })
  .listen(5000);
