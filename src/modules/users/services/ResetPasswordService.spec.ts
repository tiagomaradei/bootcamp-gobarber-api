import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Tiago',
      email: 'tiago.maradei@gmail.com',
      password: '123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);
    const genereteHash = jest.spyOn(fakeHashProvider, 'genereteHash');

    await resetPassword.execute({
      token,
      password: '1234',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(genereteHash).toHaveBeenCalledWith('1234');
    expect(updatedUser?.password).toBe('1234');
  });

  it('should NOT be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: '12343',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('123');

    await expect(
      resetPassword.execute({
        token,
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Tiago',
      email: 'tiago.maradei@gmail.com',
      password: '123',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        token,
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
