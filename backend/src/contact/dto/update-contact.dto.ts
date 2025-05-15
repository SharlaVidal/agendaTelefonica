import { IsString, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsInt()
  @ApiProperty()
  age: number;
  
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: [String] })
  @Type(() => String)
  phones: string[];
}