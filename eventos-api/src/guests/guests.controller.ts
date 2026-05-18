import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateGuestDto, UpdateGuestDto } from './guests.dto';

@ApiTags('Guests')
@ApiBearerAuth()
@Controller('events/:id/guests')
export class GuestsController {
  @Get()
  @ApiOperation({ summary: 'Lista convidados do evento' })
  @ApiResponse({ status: 200, description: 'Lista de convidados' })
  findAll(@Param('id') eventId: string) {
    // TODO: implementar
    return [];
  }

  @Post()
  @ApiOperation({ summary: 'Adiciona convidado ao evento' })
  @ApiResponse({ status: 201, description: 'Convidado adicionado' })
  create(@Param('id') eventId: string, @Body() dto: CreateGuestDto) {
    // TODO: implementar
    return {};
  }

  @Patch(':guestId')
  @ApiOperation({ summary: 'Atualiza status de presença' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  update(
    @Param('id') eventId: string,
    @Param('guestId') guestId: string,
    @Body() dto: UpdateGuestDto,
  ) {
    // TODO: implementar
    return {};
  }

  @Delete(':guestId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove convidado' })
  @ApiResponse({ status: 204, description: 'Removido' })
  remove(@Param('id') eventId: string, @Param('guestId') guestId: string) {
    // TODO: implementar
  }
}
