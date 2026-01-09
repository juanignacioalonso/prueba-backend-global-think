import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  // 1. Mock del Servicio
  // Aquí definimos qué devuelven las funciones falsas
  const mockUsersService = {
    create: jest.fn((dto) => {
      return { _id: '1', ...dto }; // Simulamos que devuelve el objeto con un ID
    }),
    findAll: jest.fn(() => []),
    findOne: jest.fn((id) => ({ _id: id, nombre: 'Test User' })),
    update: jest.fn((id, dto) => ({ _id: id, ...dto })),
    remove: jest.fn((id) => ({ _id: id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- NUEVOS TESTS AGREGADOS ---

  describe('create', () => {
    it('debería crear un usuario', async () => {
      const dto: CreateUserDto = {
        nombre: 'Juan',
        email: 'juan@test.com',
        password: '123',
        edad: 25,
        codigoPerfil: 'C02'
      };

      const result = await controller.create(dto);

      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ _id: '1', ...dto });
    });
  });

  describe('findAll', () => {
    it('debería devolver un array de usuarios', async () => {
      const result = await controller.findAll();

      expect(mockUsersService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debería devolver un usuario por ID', async () => {
      const id = '1';
      const result = await controller.findOne(id);

      expect(mockUsersService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual({ _id: id, nombre: 'Test User' });
    });
  });

  describe('update', () => {
    it('debería actualizar un usuario', async () => {
      const id = '1';
      const dto: UpdateUserDto = { nombre: 'Juan Modificado' };

      const result = await controller.update(id, dto);

      expect(mockUsersService.update).toHaveBeenCalledWith(id, dto);
      expect(result._id).toEqual(id);
      expect(result.nombre).toEqual('Juan Modificado');
    });
  });

  describe('remove', () => {
    it('debería eliminar un usuario', async () => {
      const id = '1';
      const result = await controller.remove(id);

      expect(mockUsersService.remove).toHaveBeenCalledWith(id);
      expect(result).toBeDefined();
    });
  });
});