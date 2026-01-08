import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
// 1. IMPORTANTE: Importar los validadores
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// 2. Agregamos los decoradores a la clase
export class LoginDto {
    @ApiProperty({ example: 'juan@gmail.com' })
    @IsEmail() // <--- Esto le dice a Nest: "El campo email es válido y requerido"
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'alohomora' })
    @IsString() // <--- Esto valida el password
    @IsNotEmpty()
    password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Loguearse y obtener Token' })
    signIn(@Body() signInDto: LoginDto) {
        return this.authService.login(signInDto.email, signInDto.password);
    }
}