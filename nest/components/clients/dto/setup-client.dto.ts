import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class SetupClientQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    days?: number = 0;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ obj }) => {
        return obj.isMuted === 'true';
    })
    @IsBoolean()
    archiveOld?: boolean = true;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    mobile?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ obj }) => {
        return obj.isMuted === 'true';
    })
    @IsBoolean()
    formalities?: boolean = true;
}
