import app from './app.js';
import env from './config/env.js';

const server = app.listen(env.port, () => {
  console.log(`API listening on port ${env.port} (${env.nodeEnv})`);
});

const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];

signals.forEach((signal) => {
  process.on(signal, () => {
    server.close(() => {
      console.log('Server closed gracefully');
      process.exit(0);
    });
  });
});
