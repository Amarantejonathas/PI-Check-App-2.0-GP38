import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto, AuthResponseDto, UserPayloadDto } from './auth.dto';

/**
 * Serviço de autenticação
 * Responsável por lógica de registro, login e geração de JWT
 * Em produção, integraria com banco de dados e hashing de senha
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private users: Map<string, { id: string; email: string; name: string; password: string }> = new Map();

  constructor(private readonly jwtService: JwtService) {
    this.initializeMockUsers();
  }

  /**
   * Registra um novo usuário
   * @throws ConflictException se email já existe
   */
  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    // Validar se email já existe
    if (this.users.has(dto.email)) {
      this.logger.warn(`Tentativa de registro com email duplicado: ${dto.email}`);
      throw new ConflictException('Este email já está cadastrado');
    }

    // Simular hash de senha (em produção usar bcrypt)
    const userId = `user_${Date.now()}`;
    this.users.set(dto.email, {
      id: userId,
      email: dto.email,
      name: dto.name,
      password: this.hashPassword(dto.password),
    });

    return this.generateToken(userId, dto.email, dto.name);
  }

  /**
   * Realiza login de usuário
   * @throws UnauthorizedException se credenciais inválidas
   */
  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = this.users.get(dto.email);

    if (!user || !this.validatePassword(dto.password, user.password)) {
      this.logger.warn(`Falha de login: ${dto.email}`);
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return this.generateToken(user.id, user.email, user.name);
  }

  /**
   * Valida token JWT e retorna payload
   */
  async validateToken(token: string): Promise<UserPayloadDto> {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      this.logger.error(`Token inválido: ${error.message}`);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  /**
   * Gera JWT com tempo de expiração
   */
  private generateToken(userId: string, email: string, name: string): AuthResponseDto {
    const payload: UserPayloadDto = { id: userId, email, name };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hora
    };
  }

  /**
   * Simula hash de senha (usar bcrypt em produção)
   */
  private hashPassword(password: string): string {
    return Buffer.from(password).toString('base64');
  }

  /**
   * Valida senha contra hash
   */
  private validatePassword(password: string, hash: string): boolean {
    return Buffer.from(password).toString('base64') === hash;
  }

  /**
   * Inicializa usuários de mock para testes
   */
  private initializeMockUsers(): void {
    this.users.set('teste@email.com', {
      id: 'user_1',
      email: 'teste@email.com',
      name: 'Usuário Teste',
      password: this.hashPassword('Senha@123'),
    });
  }
}
