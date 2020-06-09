import redis from 'redis';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';
import cacheConfig from '@config/cache';
import rateLimiterConfig from '@config/rateLimiter';

const { host, port, password } = cacheConfig.config.redis;
const {
  requests_per_second,
  requests_block_duration,
} = rateLimiterConfig.config;

const redisClient = redis.createClient({
  host,
  port,
  password,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: requests_per_second,
  duration: requests_block_duration,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);
    return next();
  } catch {
    throw new AppError('Too many requests', 429);
  }
}
