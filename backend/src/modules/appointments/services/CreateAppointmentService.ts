import { startOfHour, isBefore, getHours, format } from 'date-fns';
import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface Request {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
        ) {}

    public async execute({ provider_id, user_id, date }: Request): Promise<Appointment> {
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const hour = date.getHours() + 3

        const appointmentDate = new Date(year, month, day, hour, 0, 0);

        if(isBefore(appointmentDate, Date.now())) {
            throw new AppError('You can not create an appointment on a past date')
        }

        if(user_id === provider_id) {
            throw new AppError('You can not create an appointment with yourself')
        }

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17 ) {
            throw new AppError('You can only create an appointment between 8a.m. and 5p.m.')
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment already booked!');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormatted}`
        })

        await this.cacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`)

        return appointment;
    }
}

export default CreateAppointmentService;
