const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;
const base = process.cwd();

function getMime(ext) {
  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
  }[ext.toLowerCase()] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  try {
    let requestPath = decodeURIComponent(req.url.split('?')[0]);
    if (requestPath.includes('..')) {
      res.statusCode = 400;
      return res.end('Bad Request');
    }

    let filePath = path.join(base, requestPath);
    if (filePath.endsWith(path.sep)) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.statusCode = 404;
        return res.end('Not found');
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', getMime(path.extname(filePath)));
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    });
  } catch (e) {
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}/`);
});
