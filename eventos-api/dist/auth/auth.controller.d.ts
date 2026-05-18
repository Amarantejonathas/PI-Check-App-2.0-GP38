import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthController {
    register(dto: RegisterDto): {
        message: string;
    };
    login(dto: LoginDto): {
        access_token: string;
    };
    logout(): {
        message: string;
    };
}
