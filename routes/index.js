var express = require('express');
var router = express.Router();
const https = require('https');
const url = require('url');


/* GET home page. */
router.get('/url/:url', function(req, res, next) {
  const URL = req.params.url;
  const parsedURL = url.parse(URL);
  console.log(parsedURL);

  console.log('Original http headers.');
  console.log(req.headers);

  delete req.headers.host;

  const urlHostName = parsedURL.hostname;
  const urlPath = parsedURL.path;

  const options = {
    hostname: 'baidu.com',
    port: 443,
    path: '/',
    method: 'GET',
    headers: req.headers
  };

  console.log('Options for get');
  console.log(options);

  https.get(options, (resp) => {

    console.log('HTTP headers got from server.')
    console.log('headers:', resp.headers);
    console.log('status code:', resp.statusCode);

    if (resp.statusCode != 200) {
      //res.statusCode = resp.statusCode;
    }

    res.set(resp.headers);

    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(data);
      res.end(data);
      //res.render('index', { title: 'Express' });
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

});

module.exports = router;
