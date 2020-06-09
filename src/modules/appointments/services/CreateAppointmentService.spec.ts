import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 12).getTime();
    });

    const { appointment } = await createAppointment.execute({
      date: new Date(2020, 4, 19, 13),
      provider_id: '1234',
      user_id: '999',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('12345');
  });

  it('should NOT be able to create two appointments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 21, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 22, 13);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1234',
      user_id: '999',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '1234',
        user_id: '999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 19, 11),
        provider_id: '1234',
        user_id: '999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 13),
        provider_id: '999',
        user_id: '999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should NOT be able to create an appointment outsite available schedule', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 19, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 7),
        provider_id: '1234',
        user_id: '999',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 18),
        provider_id: '1234',
        user_id: '999',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
