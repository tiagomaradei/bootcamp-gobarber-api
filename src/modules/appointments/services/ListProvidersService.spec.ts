import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all providers expect a logged user', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'tiago.maradei1@gmail.com',
      name: 'Tiago 1',
      password: '123',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'tiago.maradei2@gmail.com',
      name: 'Tiago 2',
      password: '123',
    });

    const loggedUser = await fakeUsersRepository.create({
      email: 'tiago.maradei3@gmail.com',
      name: 'Tiago 3',
      password: '123',
    });

    const providers = await listProviders.execute(loggedUser.id);

    expect(providers).toEqual([user1, user2]);
  });
});
