const http = require('http'); // 1 - Import Node.js core module
const fs = require('fs/promises');
const path = require('path');
const { scrapeOkko } = require('./okko/okko-scraper');
const { scrapeUpg } = require('./upg/upg-scraper');

const processResponse = async ({
  res,
  fetchData,
  fallbackFilePath,
}) => {
  const fallback = await fs.readFile(fallbackFilePath);

  try {
    const stations = await fetchData();

    await fs.writeFile(fallbackFilePath, JSON.stringify(stations, null, 2));

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

    res.write(JSON.stringify(stations));
  } catch (error) {
    console.warn(error);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

    res.write(fallback);
  } finally {
    res.end();
  }
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
        fallbackFilePath: path.resolve(__dirname, 'okko', 'okko-stations.json'),
        fetchData: scrapeOkko,
      });

      break;
    }

    case '/upg-stations': {
      await processResponse({
        res,
        fallbackFilePath: path.resolve(__dirname, 'upg', 'upg-stations.json'),
        fetchData: scrapeUpg,
      });

      break;
    }

    default: {
      res.end('Invalid Request');
    }
  }
});

server.listen(4565, () => {
  console.info('Server is listening');
});
