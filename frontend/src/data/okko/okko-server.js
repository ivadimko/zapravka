const http = require('http'); // 1 - Import Node.js core module
const fs = require('fs/promises');
const path = require('path');
const { fetchOkkoData } = require('./okko-fetcher');

const server = http.createServer(async (req, res) => { // 2 - creating server
  switch (req.url) {
    case '/okko-stations': {
      const filePath = path.resolve(__dirname, 'okko-stations.json');

      console.info({
        socket: req.socket.remoteAddress,
        connection: req.connection.remoteAddress,
        forwarded: req.headers['x-forwarded-for'],
      });

      const fallback = await fs.readFile(filePath);

      try {
        const stations = await fetchOkkoData();

        await fs.writeFile(filePath, JSON.stringify(stations, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

        res.write(JSON.stringify(stations));
      } catch (error) {
        console.warn(error);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

        res.write(fallback);
      } finally {
        res.end();
      }

      break;
    }

    default: {
      res.end('Invalid Request');
    }
  }
});

server.listen(4565, () => {
  console.info('Server is listening, starting interval');

  setInterval(async () => {
    console.info('re-fectch');

    await fetchOkkoData();
  }, 1000 * 60);
});
