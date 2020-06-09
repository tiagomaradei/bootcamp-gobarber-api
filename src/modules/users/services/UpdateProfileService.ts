import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    const existingUserEmail = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found.');
    }

    const emailAlreadyUsed = (): boolean => {
      if (existingUserEmail) return existingUserEmail.id !== user.id;
      return false;
    };

    if (emailAlreadyUsed()) {
      throw new AppError('This email has been already used.');
    }

    user.name = name;
    user.email = email;

    if (password) {
      if (!old_password) {
        throw new AppError('Old password is required.');
      }

      const isValidOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!isValidOldPassword) {
        throw new AppError('Old password is not valid.');
      }

      user.password = await this.hashProvider.genereteHash(password);
    }

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
