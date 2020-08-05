import "reflect-metadata"
import { injectable, inject } from 'tsyringe'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
// import AppError from "@shared/errors/AppError"

interface Request {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) { }

    public async execute({ provider_id, day ,month, year }: Request): Promise<Array<Appointment>> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            day,
            month,
            year
        })

        return appointments
    }
}

export default ListProviderAppointmentsService;
