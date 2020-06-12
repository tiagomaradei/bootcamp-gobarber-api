import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProdiver';
import User from '@modules/users/infra/typeorm/entities/User';

@injectable()
class ListProviderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(user_id: string): Promise<User[]> {
    const cacheKey = `providers-list:${user_id}`;
    let providers = await this.cacheProvider.recover<User[]>(cacheKey);

    if (!providers) {
      providers = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(cacheKey, classToClass(providers));
    }

    return providers;
  }
}

export default ListProviderService;
