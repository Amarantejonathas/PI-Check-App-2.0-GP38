import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';
export declare class TasksController {
    findAll(eventId: string): any[];
    create(eventId: string, dto: CreateTaskDto): {};
    update(eventId: string, taskId: string, dto: UpdateTaskDto): {};
    remove(eventId: string, taskId: string): void;
}
