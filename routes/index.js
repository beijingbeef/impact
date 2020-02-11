var express = require('express');
var router = express.Router();
const https = require('https');
const url = require('url');

const getViaProxy = (fullUrl, headers) => {

  const parsedUrl = url.parse(fullUrl);
  const urlHostName = parsedUrl.hostname;
  const urlPath = parsedUrl.path || '/';

  if (headers.host) {
    delete headers.host;
  }

  const options = {
    hostname: urlHostName,
    port: 443,
    path: urlPath,
    method: 'GET',
    headers: headers
  };

  return new Promise((resovle, reject) => {

    https.get(options, (resp) => {

      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resovle({
          body: data,
          response: resp
        });
      });

    }).on("error", (err) => {
      reject(err);
    });

  });

}

/* GET home page. */
router.get('/url/:url', function(req, res, next) {
  const URL = req.params.url;
  let evyyNetCookie = '';
  // vist evyy.net
  getViaProxy(URL, Object.assign({}, req.headers)).then((data) => {
    console.log(data.response.statusCode);
    console.log(data.response.headers);
    const location = data.response.headers.location;
    const cookie = data.response.headers['set-cookie'][0].split(';')[0];
    evyyNetCookie = cookie;
    // vist ojrq.net
    return getViaProxy(
      location,
      Object.assign({}, req.headers));
  }).then((data) => {
    console.log(data.response.statusCode);
    console.log(data.response.headers);
    // vist evyy.net
    const location = data.response.headers.location;
    return getViaProxy(
      location,
      Object.assign({}, req.headers, {Cookie: evyyNetCookie}));
  }).then((data) => {
    console.log(data.response.statusCode);
    console.log(data.response.headers);
    const location = data.response.headers.location;
    res.redirect(data.response.statusCode, location);
  }).catch((err) => {
    console.log(err);
    res.render('index', { title: 'Express' });
  });
});

module.exports = router;
