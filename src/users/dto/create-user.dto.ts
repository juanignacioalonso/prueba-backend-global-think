import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProfileDto {
    @ApiProperty({ example: 'ADMIN_01' })
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @ApiProperty({ example: 'Administrador' })
    @IsString()
    @IsNotEmpty()
    nombre_perfil: string;
}

export class CreateUserDto {
    @ApiProperty({ example: 'Juan Perez' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: 'juan@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 30 })
    @IsNumber()
    @IsNotEmpty()
    edad: number;

    @ApiProperty()
    @IsObject()
    @ValidateNested()
    @Type(() => ProfileDto)
    perfil: ProfileDto;
}