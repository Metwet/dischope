import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, ValidateIf } from 'class-validator';

export class FindTasksQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @ValidateIf((dto: FindTasksQueryDto) => dto.sprintNumber !== undefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sprintYear?: number;

  @ValidateIf((dto: FindTasksQueryDto) => dto.sprintYear !== undefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sprintNumber?: number;
}
