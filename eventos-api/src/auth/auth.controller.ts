import { Body, Controller, Post, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterDto, LoginDto, AuthResponseDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Tentativa de registro: ${dto.email}`);
      const result = await this.authService.register(dto);
      this.logger.log(`Usuário registrado com sucesso: ${dto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro no registro: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticação de usuário e geração de JWT' })
  @ApiResponse({ status: 200, description: 'Token JWT retornado', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    try {
      this.logger.log(`Tentativa de login: ${dto.email}`);
      const result = await this.authService.login(dto);
      this.logger.log(`Login bem-sucedido: ${dto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro no login: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout do usuário' })
  @ApiResponse({ status: 200, description: 'Sessão encerrada com sucesso' })
  logout() {
    this.logger.log('Usuário desconectado');
    return { message: 'Logout realizado com sucesso', timestamp: new Date().toISOString() };
  }
}
