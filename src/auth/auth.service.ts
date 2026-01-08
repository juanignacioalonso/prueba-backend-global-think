import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async login(email: string, pass: string) {
        // 1. Buscar usuario
        const user = await this.usersService.findOneByEmail(email);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        // 2. Comparar contraseñas
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

        const payload = {
            sub: user._id,
            email: user.email,
            role: user.perfil.nombre_perfil
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}