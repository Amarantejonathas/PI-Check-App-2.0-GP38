import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto, UpdateTaskDto } from './tasks.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('events/:id/tasks')
export class TasksController {
  @Get()
  @ApiOperation({ summary: 'Lista tarefas do evento' })
  @ApiResponse({ status: 200, description: 'Lista de tarefas' })
  findAll(@Param('id') eventId: string) {
    // TODO: implementar
    return [];
  }

  @Post()
  @ApiOperation({ summary: 'Cria tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa criada' })
  create(@Param('id') eventId: string, @Body() dto: CreateTaskDto) {
    // TODO: implementar
    return {};
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Atualiza tarefa (título ou completed)' })
  @ApiResponse({ status: 200, description: 'Tarefa atualizada' })
  update(
    @Param('id') eventId: string,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    // TODO: implementar
    return {};
  }

  @Delete(':taskId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove tarefa' })
  @ApiResponse({ status: 204, description: 'Removida' })
  remove(@Param('id') eventId: string, @Param('taskId') taskId: string) {
    // TODO: implementar
  }
}
