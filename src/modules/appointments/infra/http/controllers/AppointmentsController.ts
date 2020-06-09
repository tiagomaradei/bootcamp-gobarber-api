import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import {
  socketConnection,
  socketConnectedClients,
} from '@shared/infra/http/socket';

// Controlers devem ter no maximo 5 métodos: index, show, create, update, delete

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;
    const createAppointment = container.resolve(CreateAppointmentService);

    const { appointment, notification } = await createAppointment.execute({
      provider_id,
      user_id,
      date,
    });

    if (socketConnectedClients) {
      const ownerSocket = socketConnectedClients[provider_id];

      if (ownerSocket && socketConnection) {
        socketConnection.to(ownerSocket).emit('notification', notification);
      }
    }

    return response.json(appointment);
  }
}
