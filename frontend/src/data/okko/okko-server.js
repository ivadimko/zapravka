const http = require('http'); // 1 - Import Node.js core module
const { fetchOkkoData } = require('./okko-fetcher');

const server = http.createServer(async (req, res) => { // 2 - creating server
  switch (req.url) {
    case '/okko-stations': {
      const stations = await fetchOkkoData();
      res.writeHead(200, { 'Content-Type': 'application/json' });

      res.write(JSON.stringify(stations));
      res.end();
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
