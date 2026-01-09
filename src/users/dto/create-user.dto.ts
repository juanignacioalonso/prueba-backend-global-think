import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

    @ApiProperty({
        example: 'C01',
        description: 'Código de perfil: C01 para Admin (crea perfil completo), C02 para User'
    })
    @IsString()
    @IsNotEmpty()
    codigoPerfil: string;
}