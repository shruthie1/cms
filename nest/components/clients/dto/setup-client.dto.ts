import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class SetupClientQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    days?: number = 0;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    archiveOld?: boolean = true;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    mobile?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    formalities?: boolean = true;
}
