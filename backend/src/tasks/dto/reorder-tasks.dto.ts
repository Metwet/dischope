import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDefined,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class ReorderTasksDayDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  day: string;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  taskIds: string[];
}

export class ReorderTasksDto {
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderTasksDayDto)
  days: ReorderTasksDayDto[];
}
