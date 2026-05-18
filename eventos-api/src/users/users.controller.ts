import { Body, Controller, Delete, Get, HttpCode, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Get('me')
  @ApiOperation({ summary: 'Retorna perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário' })
  getMe() {
    // TODO: pegar usuário do JWT
    return {};
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza perfil' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado' })
  updateMe(@Body() dto: UpdateUserDto) {
    // TODO: implementar
    return {};
  }

  @Delete('me')
  @HttpCode(204)
  @ApiOperation({ summary: 'Deleta conta' })
  @ApiResponse({ status: 204, description: 'Conta removida' })
  deleteMe() {
    // TODO: implementar
  }
}
