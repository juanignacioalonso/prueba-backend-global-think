import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  // 1. Mock del Modelo de Mongoose
  // Simulamos que el modelo es una función constructora (new UserModel)
  // y que tiene métodos estáticos (findOne, findByIdAndUpdate, etc.)
  const mockUserModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'mockId123' }), // Simula el .save()
  }));

  // Agregamos los métodos estáticos al mock
  (mockUserModel as any).findOne = jest.fn();
  (mockUserModel as any).findById = jest.fn();
  (mockUserModel as any).findByIdAndUpdate = jest.fn();
  (mockUserModel as any).findByIdAndDelete = jest.fn();
  (mockUserModel as any).find = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));

    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- PRUEBAS DEL MÉTODO CREATE ---
  describe('create', () => {
    it('debería crear un ADMIN correctamente usando codigoPerfil C01', async () => {
      const createUserDto = {
        nombre: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        edad: 30,
        codigoPerfil: 'C01', // Enviamos C01
      };

      const result = await service.create(createUserDto);

      // Verificamos que se haya llamado al constructor del modelo
      expect(mockUserModel).toHaveBeenCalled();

      // Verificamos que el resultado contenga el perfil expandido
      expect(result).toMatchObject({
        nombre: 'Test Admin',
        email: 'admin@test.com',
        perfil: {
          id: 1,
          nombre_perfil: 'admin',
          codigo: 'C01',
        },
      });
      // Verificamos que NO exista codigoPerfil plano en el objeto guardado
      expect((result as any).codigoPerfil).toBeUndefined();
    });

    it('debería crear un USER correctamente usando codigoPerfil C02', async () => {
      const createUserDto = {
        nombre: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        edad: 20,
        codigoPerfil: 'C02', // Enviamos C02
      };

      const result = await service.create(createUserDto);

      expect(result).toMatchObject({
        perfil: {
          id: 2,
          nombre_perfil: 'user',
          codigo: 'C02',
        },
      });
    });

    it('debería lanzar BadRequestException si el código es inválido', async () => {
      const invalidDto = {
        nombre: 'Fail',
        email: 'fail@test.com',
        password: '123',
        edad: 20,
        codigoPerfil: 'ZZ99', // Código inválido
      };

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  // --- PRUEBAS DEL MÉTODO GET (findOne) ---
  describe('findOne', () => {
    it('debería retornar un usuario si el ID es válido y existe', async () => {
      const mockUser = { _id: '507f1f77bcf86cd799439011', nombre: 'Juan' };

      // Simulamos la cadena .findById(id).exec()
      (userModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar BadRequestException si el ID no es válido para Mongo', async () => {
      // '123' no es un ID válido de 24 caracteres hex
      await expect(service.findOne('123')).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      // Simulamos que Mongo devuelve null
      (userModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  // --- PRUEBAS DEL MÉTODO DELETE (remove) ---
  describe('remove', () => {
    it('debería eliminar un usuario si existe', async () => {
      const validId = '507f1f77bcf86cd799439011';

      // Simulamos que findByIdAndDelete encuentra y borra algo
      (userModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: validId, nombre: 'Borrado' }),
      });

      // Como remove devuelve void (Promise<void>), solo esperamos que no explote
      await expect(service.remove(validId)).resolves.not.toThrow();

      // Y verificamos que se llamó a la función correcta
      expect(userModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
    });

    it('debería lanzar BadRequestException si el ID es inválido', async () => {
      await expect(service.remove('id-invalido')).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar NotFoundException si intenta borrar un usuario que no existe', async () => {
      // Simulamos que Mongo devuelve null (no encontró nada para borrar)
      (userModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
    });
  });

  // --- PRUEBAS DEL MÉTODO UPDATE ---
  describe('update', () => {
    it('debería actualizar el perfil a ADMIN si se envía C01', async () => {
      const updateDto = { codigoPerfil: 'C01' };
      const userId = '507f1f77bcf86cd799439011'; // Un ID falso válido de Mongo

      // Simulamos la respuesta de Mongoose
      (userModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          _id: userId,
          nombre: 'Juan',
          perfil: { id: 1, nombre_perfil: 'admin', codigo: 'C01' }, // Lo que esperamos que devuelva la BD
        }),
      });

      const result = await service.update(userId, updateDto);

      // Verificamos que se llamó a Mongo con el payload correcto
      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          perfil: { id: 1, nombre_perfil: 'admin', codigo: 'C01' } // <-- Aquí está la magia
        }),
        { new: true }
      );

      expect(result.perfil.nombre_perfil).toBe('admin');
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      const userId = '507f1f77bcf86cd799439011';

      // Simulamos que Mongo devuelve null
      (userModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(userId, { codigoPerfil: 'C01' })).rejects.toThrow(NotFoundException);
    });
  });
});