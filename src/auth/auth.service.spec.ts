import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('token_jwt_simulado_123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  // --- PRUEBA DEL LOGIN ---
  describe('login', () => {
    it('debería retornar un access_token si las credenciales son correctas', async () => {
      // 1. Preparamos los datos
      const email = 'test@test.com';
      const password = '123';

      // El usuario simulado DEBE tener la estructura que tu código usa (perfil.nombre_perfil)
      const mockUser = {
        _id: 'user_id_1',
        email: email,
        password: 'hashed_password',
        perfil: { nombre_perfil: 'admin' }
      };

      // 2. Configuración de los Mocks
      // A) Cuando busque el email, encuentra al usuario
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
      // B) Cuando compara contraseñas, dice que son iguales
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // 3. Ejecución de la función login
      const result = await service.login(email, password);

      // 4. Verificaciones
      // Verificación de que buscó al usuario
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(email);

      // Verificación de que comparó la contraseña
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);

      // Verificación de que generó el token con el PAYLOAD correcto (incluyendo role)
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser._id,
        email: mockUser.email,
        role: mockUser.perfil.nombre_perfil
      });

      // Verificación del resultado final
      expect(result).toEqual({ access_token: 'token_jwt_simulado_123' });
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      // Simulamos que no encuentra nada (null)
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.login('fail@test.com', '123'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const mockUser = {
        email: 'test@test.com',
        password: 'hash',
        perfil: { nombre_perfil: 'user' }
      };

      // Encuentra usuario...
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
      // ...pero la contraseña no coincide
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test@test.com', 'wrongPass'))
        .rejects.toThrow(UnauthorizedException);
    });
  });
});