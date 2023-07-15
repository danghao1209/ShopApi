import { Redis } from "ioredis";

class RedisClient {
  constructor() {
    this.redis = new Redis();
  }

  async get(key) {
    return await this.redis.get(key);
  }

  async set(key, value) {
    return await this.redis.set(key, value);
  }
  async setWithTime(key, value, time) {
    return await this.redis.psetex(key, value, time);
  }
  async deleteKey(key) {
    return await this.redis.del(key);
  }
  // Thêm các phương thức khác tùy theo nhu cầu của bạn
}

export const redisClient = new RedisClient();
