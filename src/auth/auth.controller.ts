import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class LoginDto {
    @ApiProperty({ example: 'juan@gmail.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'alohomora' })
    @IsString()
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
    async login(@Body() signInDto: LoginDto) {
        return this.authService.login(signInDto.email, signInDto.password);
    }
}