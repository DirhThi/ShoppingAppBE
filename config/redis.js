import Redis from 'ioredis';
let client;

function connectToClient() {
  if (!client) {
    client = new Redis({
      host: 'localhost',
      port: 6379
    });
  }

  return client;
}

export { connectToClient }