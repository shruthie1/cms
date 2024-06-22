import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateBufferClientDto {
  @ApiProperty({
    description: 'Telegram ID of the client',
    example: '123456789',
  })
  @IsString()
  readonly tgId: string;

  @ApiProperty({
    description: 'Mobile number of the client',
    example: '+1234567890',
  })
  @IsString()
  readonly mobile: string;

  @ApiProperty({
    description: 'Date of the session',
    example: '2023-06-22',
  })
  @IsString()
  readonly date: string;

  @ApiProperty({
    description: 'Session identifier',
    example: 'session123',
  })
  @IsString()
  readonly session: string;

  @ApiProperty({
    description: 'Two Factor Authentication enabled or not',
    example: true,
    default : false
  })
  @IsBoolean()
  readonly twoFa: boolean = false;

  @ApiPropertyOptional({
    description: 'Password for the client',
    example: 'password123',
    default: null
  })
  @IsOptional()
  @IsString()
  readonly password: string = null
}
