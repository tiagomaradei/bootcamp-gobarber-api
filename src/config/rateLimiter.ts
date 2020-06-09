interface IRateLimiterConfig {
  config: {
    requests_per_second: number;
    requests_block_duration: number;
  };
}

export default {
  config: {
    requests_per_second: Number(process.env.REQUESTS_PER_SECOND),
    requests_block_duration: Number(process.env.REQUESTS_BLOCK_DURATION),
  },
} as IRateLimiterConfig;
