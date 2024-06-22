import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class SearchBufferClientDto {
  @ApiPropertyOptional({
    description: 'Telegram ID of the client',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  readonly tgId?: string;

  @ApiPropertyOptional({
    description: 'Mobile number of the client',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  readonly mobile?: string;

  @ApiPropertyOptional({
    description: 'Date of the session',
    example: '2023-06-22',
  })
  @IsOptional()
  @IsString()
  readonly date?: string;

  @ApiPropertyOptional({
    description: 'Session identifier',
    example: 'session123',
  })
  @IsOptional()
  @IsString()
  readonly session?: string;

  @ApiPropertyOptional({
    description: 'Two Factor Authentication enabled or not',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  readonly twoFa?: boolean;

  @ApiPropertyOptional({
    description: 'Password for the client',
    example: 'password123',
  })
  @IsOptional()
  @IsString()
  readonly password?: string;
}
