import app from './app';
import { connectDB } from './db';
import { env } from '../env';
import http from 'http';
import { initializeSocket } from './socket/socket.server';

const server = http.createServer(app);

initializeSocket(server);

const start = async () => {
  await connectDB();

  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
    console.log(`API: http://localhost:${env.PORT}/api/v1`);
    console.log(`Docs: http://localhost:${env.PORT}/api-docs`);
  });
};

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close();
  const { default: mongoose } = await import('mongoose');
  await mongoose.disconnect();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
