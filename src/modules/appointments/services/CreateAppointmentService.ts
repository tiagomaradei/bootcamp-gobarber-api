import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';
import AppError from '@shared/errors/AppError';
import ICreateAppoitmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProdiver';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface ICreateAppointmentReponse {
  appointment: Appointment;
  notification: Notification;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: ICreateAppoitmentDTO): Promise<ICreateAppointmentReponse> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("Can't create an appointement on a past date.");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        "Can't create an appointement before 8am or after 5pm.",
      );
    }

    if (user_id === provider_id) {
      throw new AppError("Cant't create an appointment for own provider.");
    }

    const finAppoitmentsInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (finAppoitmentsInSameDate) {
      throw new AppError('This appoitment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    const notification = await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}-${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return {
      appointment,
      notification,
    };
  }
}

export default CreateAppointmentService;
