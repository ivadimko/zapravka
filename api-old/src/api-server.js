import http from 'http';
import fs from 'fs/promises';
import path from 'path';

const processResponse = async ({
  res,
  filePath,
}) => {
  const file = await fs.readFile(filePath);

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

  res.write(file);

  res.end();
};

const server = http.createServer(async (req, res) => {
  console.info({
    socket: req.socket.remoteAddress,
    forwarded: req.headers['x-forwarded-for'],
    url: req.url,
  });

  switch (req.url) {
    case '/okko-stations': {
      await processResponse({
        res,
        filePath: path.resolve('src/data/okko/okko-stations.json'),
      });

      break;
    }

    case '/upg-stations': {
      await processResponse({
        res,
        filePath: path.resolve('src/data/upg/upg-stations.json'),
      });

      break;
    }

    default: {
      res.end('Invalid Request');
    }
  }
});

server.listen(process.env.PORT || 4565, () => {
  console.info('Server is listening');
});
