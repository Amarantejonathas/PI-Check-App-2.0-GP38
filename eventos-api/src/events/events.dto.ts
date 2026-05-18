import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'Aniversário da Maria' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Festa de aniversário', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-12-01T18:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'Rua das Flores, 123' })
  @IsString()
  location: string;
}

export class UpdateEventDto extends CreateEventDto {}
