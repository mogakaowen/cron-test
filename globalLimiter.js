import { RateLimiterRedis } from 'rate-limiter-flexible';
import { client } from './redis.js';

const globalLimiter = new RateLimiterRedis({
    storeClient: client,
    keyPrefix: 'global-users-api',
    points: 2,
    duration: 1,
});


export default globalLimiter;
