import { ApiProperty } from '@nestjs/swagger';
import {  IsString } from 'class-validator';

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
  readonly createdDate: string;

  @ApiProperty({
    description: 'Date of the session',
    example: '2023-06-22',
  })
  @IsString()
  readonly availableDate: string;

  @ApiProperty({
    description: 'Session identifier',
    example: 'session123',
  })
  @IsString()
  readonly session: string;
}
