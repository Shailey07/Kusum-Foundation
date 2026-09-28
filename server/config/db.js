const mongoose = require('mongoose');

// Connect to MongoDB with retry-and-backoff instead of crashing.
//
// Atlas refuses connections from IPs that aren't on its Network Access list,
// which used to throw and hit `process.exit(1)` — killing the whole server so
// nodemon printed "app crashed". Now we log a clear hint and keep retrying, so
// the server recovers on its own the moment the IP is whitelisted or the
// network comes back — no manual restart needed.
const connectDB = async (attempt = 1) => {
  const MAX_DELAY = 30000; // cap the wait between retries at 30s

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Fail an attempt in 10s instead of hanging ~30s on the default.
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed (attempt ${attempt}): ${error.message}`);

    // The most common cause in development: current IP not whitelisted.
    if (/whitelist|IP address|ServerSelection|ETIMEDOUT|ENOTFOUND|querySrv/i.test(error.message)) {
      console.error(
        '👉 Your current IP is probably not whitelisted in MongoDB Atlas.\n' +
        '   Fix: Atlas → Network Access → Add IP Address →\n' +
        '        "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) is easiest for development.\n' +
        '   Also confirm MONGO_URI in server/.env and that your internet is up.'
      );
    }

    const delay = Math.min(2000 * 2 ** (attempt - 1), MAX_DELAY);
    console.log(`⏳ Retrying in ${delay / 1000}s... (server will start automatically once connected)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return connectDB(attempt + 1);
  }
};

// After the first successful connect, mongoose auto-reconnects on drops.
// These listeners just make what's happening visible in the console.
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected — mongoose will attempt to reconnect.');
});
mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

module.exports = connectDB;
