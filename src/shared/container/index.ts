import { container } from 'tsyringe';
import '@modules/users/providers';
import './providers';
import IAppointementsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import AppointementsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/Repositories/NotificationsRepository';

container.registerSingleton<IAppointementsRepository>(
  'AppointmentsRepository',
  AppointementsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
