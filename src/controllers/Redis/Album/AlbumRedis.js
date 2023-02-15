const redis = require("redis");

class CacheAlbum {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });
    this._client.on("error", (error) => console.error(`Error : ${error}`));

    this._client.connect();
  }

  async _setCache(key, data, expirationInSecond = 1800) {
    await this._client.set(key, JSON.stringify(data), {
      EX: expirationInSecond,
    });
  }

  async _getCache(key) {
    const result = await this._client.get(key);

    return JSON.parse(result);
  }

  _deleteCache(key) {
    return this._client.del(key);
  }
}

module.exports = CacheAlbum;
