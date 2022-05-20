const http = require('http'); // 1 - Import Node.js core module
const { fetchOkkoData } = require('./okko-fetcher');

const server = http.createServer(async (req, res) => { // 2 - creating server
  switch (req.url) {
    case '/okko-stations': {
      console.info({
        socket: req.socket.remoteAddress,
        connection: req.connection.remoteAddress,
        forwarded: req.headers['x-forwarded-for'],
      });

      const stations = await fetchOkkoData();

      try {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

        res.write(JSON.stringify(stations));
      } catch (error) {
        res.writeHead(400);

        res.write(error.message);
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
