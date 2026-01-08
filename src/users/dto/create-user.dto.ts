import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested, IsObject, IsEnum, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

class ProfileDto {
    @ApiProperty({ example: 'C01' })
    @IsString()
    @IsNotEmpty()
    codigo: string;

    @ApiProperty({ example: 'admin', enum: UserRole })
    @IsEnum(UserRole, { message: 'El rol debe ser admin o user' })
    nombre_perfil: UserRole;
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

    @ApiProperty({ example: 'secret123', description: 'Mínimo 6 caracteres' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

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