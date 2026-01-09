import { BadRequestException, Injectable, NotFoundException, ConflictException, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

const PERFILES_CONFIG = {
  'C01': {
    id: 1,
    nombre_perfil: 'admin',
    codigo: 'C01'
  },
  'C02': {
    id: 2,
    nombre_perfil: 'user',
    codigo: 'C02'
  }
};

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async onModuleInit() {
    const adminEmail = 'admin@admin.com';
    const exists = await this.userModel.findOne({ email: adminEmail });

    if (!exists) {
      console.log('🌱 Base de datos vacía. Creando Admin...');
      await this.create({
        nombre: 'Administrador Sistema',
        email: adminEmail,
        password: 'admin123',
        edad: 99,
        codigoPerfil: 'C01'
      } as CreateUserDto);
      console.log('✅ Admin creado: admin@admin.com / admin123');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, codigoPerfil, ...userData } = createUserDto;
    const perfilSeleccionado = PERFILES_CONFIG[codigoPerfil];

    if (!perfilSeleccionado) {
      throw new BadRequestException(`Código '${codigoPerfil}' inválido. Use C01 o C02.`);
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createdUser = new this.userModel({
        ...userData,
        password: hashedPassword,
        perfil: perfilSeleccionado
      });

      return await createdUser.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('El correo electrónico ya existe');
      }
      console.error(error);
      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(role?: string): Promise<User[]> {
    const filter = role ? { 'perfil.nombre_perfil': role } : {};
    return this.userModel.find(filter).exec();
  }

  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) throw new BadRequestException(`ID inválido`);
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`Usuario no encontrado`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!isValidObjectId(id)) throw new BadRequestException(`ID inválido`);

    const { codigoPerfil, ...updateData } = updateUserDto;

    const payload: any = { ...updateData };

    if (codigoPerfil) {
      const perfilSeleccionado = PERFILES_CONFIG[codigoPerfil];

      if (!perfilSeleccionado) {
        throw new BadRequestException(`Código '${codigoPerfil}' inválido.`);
      }

      payload.perfil = perfilSeleccionado;
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, payload, { new: true })
        .exec();

      if (!updatedUser) throw new NotFoundException(`Usuario no encontrado`);
      return updatedUser;

    } catch (error: any) {
      if (error.code === 11000) throw new ConflictException('Email en uso');
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) throw new BadRequestException(`ID inválido`);
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Usuario no encontrado`);
  }
}