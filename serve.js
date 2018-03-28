const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');

const app = express();

app.use("/", expressStaticGzip(path.join(__dirname, 'dist'), {
  enableBrotli: true
}));

app.listen(1234, () => {
  console.log('listening on http://127.0.0.1:1234')
});
