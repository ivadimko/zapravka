module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'API',
      script: 'npm run start:prod',
      instances: 1,
      watch: false,
      autorestart: true,
      cron_restart: '0 0 * * *',
    },
  ],
};
