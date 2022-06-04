module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'API',
      script: 'npm run start',
      instances: 1,
      watch: false,
      autorestart: true,
    },
    {
      name: 'Scrape OKKO',
      script: 'src/data/okko/scrape-okko-stations.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '*/10 * * * *',
      watch: false,
      autorestart: false,
    },
    {
      name: 'Scrape UPG',
      script: 'src/data/upg/scrape-upg-stations.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '*/10 * * * *',
      watch: false,
      autorestart: false,
    },
  ],
};
