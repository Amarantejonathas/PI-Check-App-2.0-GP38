import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum GuestStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
}

export class CreateGuestDto {
  @ApiProperty({ example: 'Pedro Alves' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'pedro@email.com' })
  @IsEmail()
  email: string;
}

export class UpdateGuestDto {
  @ApiProperty({ enum: GuestStatus, default: GuestStatus.PENDING })
  @IsOptional()
  @IsEnum(GuestStatus)
  status?: GuestStatus;
}
