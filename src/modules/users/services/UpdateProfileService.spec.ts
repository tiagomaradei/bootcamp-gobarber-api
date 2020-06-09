import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update an user profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'tiago.maradei@gmail.com',
      name: 'Tiago',
      password: '123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Tiago Maradei',
      email: 'tiago@startse.com',
    });

    expect(updatedUser.name).toBe('Tiago Maradei');
    expect(updatedUser.email).toBe('tiago@startse.com');
  });

  it('should NOT be able to update an user profile for a non existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: '123',
        name: 'Tiago Maradei',
        email: 'tiago@startse.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to change the email for another existing user email', async () => {
    await fakeUsersRepository.create({
      email: 'tiago.maradei@gmail.com',
      name: 'Tiago',
      password: '123',
    });

    const user = await fakeUsersRepository.create({
      email: 'tiago@startse.com',
      name: 'Tiago',
      password: '123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Tiago',
        email: 'tiago.maradei@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'tiago.maradei@gmail.com',
      name: 'Tiago',
      password: '123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Tiago Maradei',
      email: 'tiago@startse.com',
      old_password: '123',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should NOT be able to update the password without old passord', async () => {
    const user = await fakeUsersRepository.create({
      email: 'tiago.maradei@gmail.com',
      name: 'Tiago',
      password: '123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Tiago Maradei',
        email: 'tiago@startse.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to update the password with wrong old passord', async () => {
    const user = await fakeUsersRepository.create({
      email: 'tiago.maradei@gmail.com',
      name: 'Tiago',
      password: '123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Tiago Maradei',
        email: 'tiago@startse.com',
        old_password: '999',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
