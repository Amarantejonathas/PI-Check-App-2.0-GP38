import { CreateEventDto, UpdateEventDto } from './events.dto';
export declare class EventsController {
    findAll(): any[];
    create(dto: CreateEventDto): {};
    findOne(id: string): {};
    update(id: string, dto: UpdateEventDto): {};
    remove(id: string): void;
}
