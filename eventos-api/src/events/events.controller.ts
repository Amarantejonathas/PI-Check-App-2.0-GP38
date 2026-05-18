import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CreateEventDto, UpdateEventDto } from './events.dto';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Events')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista todos os eventos do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de eventos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@Request() req: any) {
    const userId = req.user?.id;
    this.logger.log(`Listando eventos do usuário: ${userId}`);
    return await this.eventsService.findAll(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um novo evento' })
  @ApiResponse({ status: 201, description: 'Evento criado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(@Request() req: any, @Body() dto: CreateEventDto) {
    const userId = req.user?.id;
    this.logger.log(`Criando novo evento para usuário: ${userId}`);
    return await this.eventsService.create(userId, dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Detalhe do evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Dados do evento' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    this.logger.log(`Buscando evento: ${id}`);
    return await this.eventsService.findOne(id, userId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualiza evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: 200, description: 'Evento atualizado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateEventDto) {
    const userId = req.user?.id;
    this.logger.log(`Atualizando evento: ${id}`);
    return await this.eventsService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove evento' })
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiResponse({ status: 204, description: 'Removido' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Não encontrado' })
  async remove(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id;
    this.logger.log(`Removendo evento: ${id}`);
    return await this.eventsService.remove(id, userId);
  }
}
