import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show an user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'tiago.maradei@gmail.com',
      name: 'Tiago',
      password: '123',
    });

    const userProfile = await showProfile.execute(user.id);

    expect(userProfile.email).toBe('tiago.maradei@gmail.com');
    expect(userProfile.name).toBe('Tiago');
  });

  it('should be NOT able to show an user profile for a non existing user', async () => {
    await expect(showProfile.execute('123')).rejects.toBeInstanceOf(AppError);
  });
});
