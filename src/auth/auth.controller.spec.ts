import { Test, TestingModule } from '@nestjs/testing';
import { AuthController, LoginDto } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ access_token: 'jwt_token_falso_123' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- PRUEBA DEL LOGIN ---
  describe('login', () => {
    it('debería retornar un access token cuando el login es exitoso', async () => {
      // 1. Datos de prueba: AHORA USAMOS EL DTO DIRECTAMENTE
      // El controlador espera un objeto con email y password, no un Request completo.
      const dto: LoginDto = {
        email: 'test@test.com',
        password: '123'
      };

      // 2. Ejecutar el método del controlador pasando el DTO
      const result = await controller.login(dto);

      // 3. Verificaciones

      // A) Verificamos que el controlador llamó al servicio con los datos del DTO
      expect(authService.login).toHaveBeenCalledWith(dto.email, dto.password);

      // B) Verificamos que el controlador devuelve el token
      expect(result).toEqual({ access_token: 'jwt_token_falso_123' });
    });
  });
});