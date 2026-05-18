import { CreateGuestDto, UpdateGuestDto } from './guests.dto';
export declare class GuestsController {
    findAll(eventId: string): any[];
    create(eventId: string, dto: CreateGuestDto): {};
    update(eventId: string, guestId: string, dto: UpdateGuestDto): {};
    remove(eventId: string, guestId: string): void;
}
