import { Router } from 'express';
import { getCustomRepository } from 'typeorm'
import { parseISO } from 'date-fns';

import AppointmenstRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const appointmentRouter = Router();

appointmentRouter.use(ensureAuthenticated)

appointmentRouter.get('/', async (request, response) => {
    console.log(request.user)

    const appointmentsRepository = getCustomRepository(AppointmenstRepository)
    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
});

appointmentRouter.post('/', async (request, response) => {
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
        date: parsedDate,
        provider_id,
    });

    return response.json(appointment);
});

export default appointmentRouter;
