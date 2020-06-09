import { container } from 'tsyringe';
import ICacheProdiver from './models/ICacheProdiver';
import RedisCacheProvider from './implementations/RedisCacheProvider';

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProdiver>('CacheProvider', providers.redis);
